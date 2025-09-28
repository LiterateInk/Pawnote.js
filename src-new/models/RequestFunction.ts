import { HeaderKeys, HttpRequest, HttpRequestMethod, HttpResponse, send } from "schwi";
import { Session } from "./Session";
import { bytesToHex, utf8ToBytes } from "@noble/ciphers/utils.js";
import { deflate } from "../core/deflate";
import { UA } from "../core/user-agent";

export abstract class RequestFunction<Data, Signature = undefined> {
  protected constructor(
    protected readonly session: Session,
    private name: string
  ) {}

  /**
   * Automatically handle encryption and compression.
   * If none of them is enabled, return simple JSON.
   */
  private async propertiesToPayload (properties: Record<string, Data | Signature>): Promise<Record<string, Data | Signature> | string> {
    let payload: Uint8Array | undefined;

    if (!this.session.api.skipCompression || !this.session.api.skipEncryption) {
      payload = utf8ToBytes(JSON.stringify(properties));
    }

    if (!this.session.api.skipCompression) {
      const buffer = utf8ToBytes(bytesToHex(payload!));
      payload = await deflate(buffer);
    }

    if (!this.session.api.skipEncryption) {
      payload = this.session.aes.encrypt(payload!);
    }

    return payload ? bytesToHex(payload) : properties;
  }

  protected async execute(data?: Data, signature?: Signature): Promise<HttpResponse> {
    return this.session.api.queue.run(async () => {
      this.session.api.order++;

      const order = bytesToHex(this.session.aes.encrypt(this.session.api.order));
      const url = `${this.session.url}/appelfonction/${this.session.homepage.webspace}/${this.session.homepage.id}/${order}`;

      const properties: Record<string, Data | Signature> = {};
      if (data) properties[this.session.api.properties.data] = data;
      if (signature) properties[this.session.api.properties.signature] = signature;

      const payload = await this.propertiesToPayload(properties);

      const request = new HttpRequest.Builder(url)
        .setMethod(HttpRequestMethod.POST)
        .setHeader(HeaderKeys.CONTENT_TYPE, "application/json")
        .setHeader(HeaderKeys.USER_AGENT, UA)
        .setJsonBody({
          [this.session.api.properties.session]: this.session.homepage.id,
          [this.session.api.properties.orderNumber]: order,
          [this.session.api.properties.requestId]: this.name,
          [this.session.api.properties.secureData]: payload
        })
        .build();

      return send(request);
    });
  }
}
