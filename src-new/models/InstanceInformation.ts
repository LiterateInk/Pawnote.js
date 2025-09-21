import { deserializeWith, rename, t, u } from "desero";
import { Webspace } from "./Webspace";

export class InstanceInformation {
  @rename("nomEtab")
  public name = t.string();

  /**
   * Three integers that represents the version of the PRONOTE instance,
   * usually goes by `[year, major, minor]`.
   */
  public version = t.array(t.number());

  @deserializeWith((date: string) => new Date(date))
  public date = t.instance<Date>();

  @rename("espaces")
  public webspaces = t.array(t.reference);

  @rename("CAS")
  public cas = t.option(t.reference(InstanceInformationCAS));
}

export class InstanceInformationWebspace {
  @rename("nom")
  public name = t.string();

  @rename("URL")
  public path = t.string();

  @rename("genreEspace")
  public id = t.enum(Webspace);
}

export class InstanceInformationCAS {
  @rename("actif")
  public active = t.boolean();

  @rename("casURL")
  @deserializeWith(u.falsyToNull)
  public url = t.option(t.string());

  @rename("jetonCAS")
  public token = t.option(t.string());
}
