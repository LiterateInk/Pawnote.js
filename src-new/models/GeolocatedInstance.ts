import { deserializeWith, t } from "desero";
import { Instance } from "./Instance";
import { haversine } from "~/core/haversine";

export class GeolocalisationValeur {
  public url = t.string();
  public nomEtab = t.string();
  @deserializeWith(parseFloat)
  public lat = t.number();
  @deserializeWith(parseFloat)
  public long = t.number();
  @deserializeWith((cp: string) => parseInt(cp))
  public cp = t.number();
}

export class GeolocatedInstance {
  /**
   * Distance between the initial geolocation (latitude, longitude)
   * and the instance (latitude, longitude) in meters.
   */
  public readonly distance: number;

  /** @internal */
  public constructor (
    private geo: GeolocalisationValeur,
    lat: number,
    lon: number
  ) {
    this.distance = haversine([lat, lon], [geo.lat, geo.long]);
  }

  public get name(): string {
    return this.geo.nomEtab
      .trim()
      .replace("COLLEGE", "COLLÈGE")
      .replace("LYCEE", "LYCÉE");
  }

  public get latitude(): number {
    return this.geo.lat;
  }

  public get longitude(): number {
    return this.geo.long;
  }

  public get postalCode(): number {
    return this.geo.cp;
  }

  public get url(): string {
    return this.geo.url;
  }

  /**
   * An alias for `Instance.fromURL(this.url)`
   */
  public toInstance(): Instance {
    return Instance.fromURL(this.url);
  }
}
