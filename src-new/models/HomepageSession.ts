import { Webspace } from "./Webspace";
import { deserializeWith, defaultValue, rename, t } from "desero";

export enum HomepageSessionAccess {
  Account = 0,
  AccountConnection = 1,
  DirectConnection = 2,
  TokenAccountConnection = 3,
  TokenDirectConnection = 4,
  CookieConnection = 5
}

export class HomepageSession {
  /**
   * Your session ID, generated on navigation.
   */
  @deserializeWith((h: string | number) => Number(h))
  @rename("h")
  public id = t.number();

  @rename("a")
  public webspace = t.enum(Webspace);

  /**
   * Whether instance is a demo instance or not.
   * For example, `https://demo.index-education.net/pronote` is one!
   *
   * On these demo instances, data is immutable, it'll never change
   * and you can barely do any action.
   */
  @rename("d")
  @defaultValue(false)
  public demo = t.option(t.boolean());

  @rename("g")
  @defaultValue(HomepageSessionAccess.Account)
  public access = t.enum(HomepageSessionAccess);

  /** @deprecated since 2023 */
  @rename("MR")
  public rsaModulus = t.option(t.string());
  /** @deprecated since 2023 */
  @rename("ER")
  public rsaExponent = t.option(t.string());

  @rename("CrA")
  @defaultValue(false)
  public enforceEncryption = t.boolean();
  @rename("CoA")
  @defaultValue(false)
  public enforceCompression = t.boolean();

  @rename("sCrA")
  @defaultValue(false)
  public skipEncryption = t.boolean();
  @rename("sCoA")
  @defaultValue(false)
  public skipCompression = t.boolean();

  /**
   * Whether instance have an SSL certificate installed or not.
   */
  @defaultValue(false)
  public http = t.boolean();

  /**
   * Whether polling should be used instead of presence.
   * @deprecated since 2025.1.3
   */
  @defaultValue(false)
  public poll = t.boolean();
}
