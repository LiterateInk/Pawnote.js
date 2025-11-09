import { HomepageSession } from "./HomepageSession";
import { InstanceInformation } from "./InstanceInformation";
import { SessionAES } from "./SessionAES";
import { SessionAPI } from "./SessionAPI";
import { SessionRSA } from "./SessionRSA";

/**
 * This is where your user data and parameters will be saved.
 * A lot of core features depends on this class, so keep it precious!
 */
export class Session {
  public readonly rsa: SessionRSA;
  public readonly aes: SessionAES;
  public readonly api: SessionAPI;

  public constructor(
    public readonly instance: InstanceInformation,
    public readonly homepage: HomepageSession,
    public readonly url: string
  ) {
    this.rsa = new SessionRSA(homepage);
    this.aes = new SessionAES();
    this.api = new SessionAPI(homepage, instance.version);
  }
}
