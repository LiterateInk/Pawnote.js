import { deserialize } from "desero";
import { Webspace } from "./models/Webspace";
import { InstanceInformation } from "./models/InstanceInformation";

export class UnreachableError extends Error {
  constructor(fn: string) {
    super(`Unhandled code reached in "${fn}" function (pawnote), please report this issue`);
    this.name = "UnreachableError";
  }
}

/**
 * What I call the **Session Maker**, this is where you'll be able to initiate
 * sessions on a given instance URL.
 *
 * @param base - Base of the instance URL.
 *
 * @example
 * const manager = new SessionManager("https://demo.index-education.net/pronote");
 *
 * @example
 * // If you're using a QR code, you can do this.
 * const manager = new SessionManager(qr.url);
 */
export class SessionManager {
  public readonly base: string;

  public constructor(base: string | URL) {
    if (!(base instanceof URL)) base = new URL(base);
    this.base = this.clean(base);
  }

  private clean(base: URL): string {
    // clean any unwanted data from URL.
    base = new URL(`${base.protocol}//${base.host}${base.pathname}`);

    // clear the last path if we're not in the main selection menu.
    const paths = base.pathname.split("/");
    if (paths[paths.length - 1].includes(".html")) {
      paths.pop();
    }

    // Rebuild URL with cleaned paths.
    base.pathname = paths.join("/");

    // Return rebuilt URL without trailing slash.
    return base.href.endsWith("/")
      ? base.href.slice(0, -1)
      : base.href;
  }

  public async getInstanceInformation() {
    const url = this.base + "/infoMobileApp.json?id=0D264427-EEFC-4810-A9E9-346942A862A4";
    const response = await fetch(url);
    const json = await response.json();
    return deserialize(InstanceInformation, json);
  }

  public createWithCredentials(webspace: Webspace) {

  }

  public createWithToken(webspace: Webspace) {

  }
}


/**
 * This is where your user data and parameters will be saved.
 * A lot of core features depends on this class, so keep it precious!
 */
export class Session {

}
