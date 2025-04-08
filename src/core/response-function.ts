import { AccessDeniedError, PageUnavailableError, RateLimitedError, ServerSideError, SessionExpiredError, SuspendedIPError, type SessionHandle } from "~/models";
import forge from "node-forge";
import { AES } from "../api/private/aes";
import pako from "pako";
import { aesKeys } from "../api/private/keys";

/**
 * ResponseFN is a class that handles the response from the server.
 * It decrypts and decompresses the data if necessary.
 * It also checks for errors in the response.
 * @param {SessionHandle} session - The current session handle.
 * @param {any} data - The data from the server.
 * @throws {ServerSideError} - If there is an error in the response.
 * @throws {SessionExpiredError} - If the session has expired.
 * @throws {SuspendedIPError} - If the IP address is suspended.
 * @throws {PageUnavailableError} - If the page is unavailable.
 * @throws {RateLimitedError} - If the rate limit is exceeded.
 * @throws {AccessDeniedError} - If access is denied.
 * @throws {Error} - If there is an unknown error.
 */
export class ResponseFN {
  public constructor (
    private readonly session: SessionHandle,
    public data: any
  ) {
    this.session.information.order++;
    const content = data;

    try {
      const response = JSON.parse(content);
      if (response.Erreur) {
        const error = response.Erreur.Titre || "Server Error";
        throw new ServerSideError(error);
      }

      this.data = response.donneesSec;

      if (!this.session.information.skipEncryption) {
        this.decrypt();
      }

      if (!this.session.information.skipCompression) {
        this.decompress();
      }

      if (typeof this.data === "string") {
        this.data = JSON.parse(this.data);
      }

      // RETROCOMPAT: _Signature_ is only available on versions < `2024.3.9`
      // We can't use `session` to check the version here because
      // we use `ResponseFN` before the `version` property is known.
      if (typeof this.data?._Signature_?.Erreur !== "undefined") {
        throw new ServerSideError(this.data._Signature_.MessageErreur);
      }

      if (typeof this.data?.Signature?.Erreur !== "undefined") {
        throw new ServerSideError(this.data.Signature.MessageErreur);
      }
    }
    catch (error) {
      if (content.includes("La page a expir")) {
        throw new SessionExpiredError();
      }

      else if (content.includes("Votre adresse IP ")) {
        throw new SuspendedIPError();
      }

      else if (content.includes("La page dem") || content.includes("Impossible d'a")) {
        throw new PageUnavailableError();
      }

      else if (content.includes("Vous avez d")) {
        throw new RateLimitedError();
      }

      // "Accès refusé", we just trying to prevent using accents.
      else if (content.includes("s refus")) {
        throw new AccessDeniedError();
      }

      throw error;
    }
  }

  private decrypt (): void {
    const { iv, key } = aesKeys(this.session);

    this.data = AES.decrypt(this.data, key, iv);

    if (!this.session.information.skipCompression) {
      this.data = forge.util.bytesToHex(this.data);
    }
  }

  private decompress (): void {
    const bytes = forge.util.hexToBytes(this.data);
    const compressed = new Uint8Array(Array.from(bytes).map((char) => char.charCodeAt(0)));
    this.data = pako.inflateRaw(compressed, { to: "string" });
  }
}
