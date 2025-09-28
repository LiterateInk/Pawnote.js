import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/ciphers/utils.js";
import { cbc } from "@noble/ciphers/aes.js";
import { md5 } from "@noble/hashes/legacy.js";

export class SessionAES {
  public iv: Uint8Array<ArrayBufferLike> = new Uint8Array(16);
  public key: Uint8Array<ArrayBufferLike> = new Uint8Array();

  /**
   * Key with MD5.
   */
  private get _mKey(): Uint8Array {
    return md5(this.key);
  }

  /**
   * IV with MD5, only if IV is not full of null bytes.
   */
  private get _mIv(): Uint8Array {
    if (this.iv.every((byte) => byte === 0x00)) {
      return this.iv;
    }

    return md5(this.iv);
  }

  /**
   * Encrypt `input` with AES parameters from this class.
   *
   * This method contains built-in helpers for the following types...
   * - `number` will be converted to a `string`
   * - `string` will be converted to an `Uint8Array`
   *
   * @param input - the data that'll be encrypted
   * @returns encrypted `input`
   */
  public encrypt(input: Uint8Array | string | number): Uint8Array {
    if (typeof input === "number") input = String(input);
    if (typeof input === "string") input = utf8ToBytes(input);
    return cbc(this._mKey, this._mIv).encrypt(input);
  }

  public decrypt(hex: string): Uint8Array {
    const bytes = hexToBytes(hex);
    return cbc(this._mKey, this._mIv).decrypt(bytes);
  }
}
