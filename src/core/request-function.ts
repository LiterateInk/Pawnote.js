import type { SessionHandle } from "~/models";
import forge from "node-forge";
import pako from "pako";
import { AES } from "../api/private/aes";
import { ResponseFN } from "./response-function";
import { aesKeys } from "../api/private/keys";

/**
 * Abstraction to make requests to function API
 * of PRONOTE.
 */
export class RequestFN {
  public constructor (
    private readonly session: SessionHandle,

    /**
     * Function name.
     *
     * This is used by the server to
     * determine the function to call.
     */
    public name: string,

    /**
     * Data given to the "secure" property.
     */
    public data: any
  ) {}

  /**
   * Make the order generation, encryption and compression.
   * @returns {{order: string;url: URL}} The order and the URL to send the request to.
   */
  public process (): { order: string; url: URL; } {
    this.session.information.order++;

    const order = this.generateOrder();
    const url = new URL(`${this.session.information.url}/appelfonction/${this.session.information.accountKind}/${this.session.information.id}/${order}`);

    if (!this.session.information.skipCompression) {
      this.compress();
    }

    if (!this.session.information.skipEncryption) {
      this.encrypt();
    }

    return { order, url };
  }

  private keys () {
    return aesKeys(this.session, this.session.information.order === 1);
  }

  private generateOrder (): string {
    const { key, iv } = this.keys();
    return AES.encrypt(this.session.information.order.toString(), key, iv);
  }

  private stringify (): string {
    return forge.util.encodeUtf8(JSON.stringify(this.data) || "");
  }

  private compress (): void {
    const buffer = forge.util.createBuffer(this.stringify()).toHex();

    // We compress it using zlib, level 6, without headers.
    const deflated = pako.deflateRaw(buffer, { level: 6 });
    const bytes = Array.from(deflated).map((byte) => String.fromCharCode(byte)).join("");

    // We output it to HEX.
    this.data = forge.util.bytesToHex(bytes);
  }

  private encrypt (): void {
    const { key, iv } = this.keys();

    const data = !this.session.information.skipCompression
      // If the data has been compressed, we get the bytes from HEX.
      ? forge.util.hexToBytes(this.data)
      : this.stringify();

    this.data = AES.encrypt(data, key, iv);
  }

  /**
   * Send the request to the server.
   * @returns {Promise<ResponseFN>} The response from the server.
   */
  public async send (): Promise<ResponseFN> {
    return this.session.queue.push(async () => {
      const payload = this.process();

      const response = await this.session.fetcher({
        url: payload.url,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        content: JSON.stringify({
          session: this.session.information.id,
          numeroOrdre: payload.order,
          nom: this.name,
          donneesSec: this.data
        })
      });

      return new ResponseFN(this.session, response.content);
    });
  }
}
