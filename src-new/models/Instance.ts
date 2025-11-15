import { deserialize } from "desero";
import { HeaderKeys, HttpRequest, HttpRequestMethod, send } from "schwi";
import { UA } from "~/core/user-agent";
import { InstanceInformation } from "./InstanceInformation";
import { GeolocalisationValeur, GeolocatedInstance } from "./GeolocatedInstance";

/**
 * @example
 * const instance = Instance.fromURL("https://demo.index-education.net/pronote");
 *
 * @example
 * // If you're using a QR code, you can do this.
 * const instance = Instance.fromURL(qr.url);
 */
export class Instance {
  public readonly base: string;

  private constructor(base: string | URL) {
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

  /**
   * @param url - Any valid URL from the instance.
   */
  public static fromURL(url: string | URL): Instance {
    return new this(url);
  }

  /**
   * Retrieve the verison of the instance and available webspaces.
   * You can also get a CAS token, needed for CAS authentication.
   */
  public async getInformation(): Promise<InstanceInformation> {
    const request = new HttpRequest.Builder(`${this.base}/infoMobileApp.json`)
      .setUrlSearchParameter("id", "0D264427-EEFC-4810-A9E9-346942A862A4")
      .setHeader(HeaderKeys.USER_AGENT, UA)
      .build();

    const response = await send(request);
    const json = await response.toJSON();

    return deserialize(InstanceInformation, json);
  }

  /**
   * Search for instances in a 20km radius from the given position.
   */
  public static async findNear(
    latitude: number, longitude: number
  ): Promise<Array<GeolocatedInstance>> {
    const body = new URLSearchParams();
    body.set("data", JSON.stringify({
      nomFonction: "geoLoc",
      lat: latitude.toString(),
      long: longitude.toString()
    }));

    const request = new HttpRequest.Builder("https://www.index-education.com/swie/geoloc.php")
      .setMethod(HttpRequestMethod.POST)
      .setFormUrlEncodedBody(body)
      .build();

    const response = await send(request);
    const json = await response.toJSON();

    if (!Array.isArray(json)) return [];

    const instances = json.map(
      (instance) => new GeolocatedInstance(
        deserialize(GeolocalisationValeur, instance),
        latitude,
        longitude
      )
    );

    // Apply PRONOTE sorting they use in their mobile app.
    instances.sort((a, b) => a.distance > b.distance
      ? 1
      : a.distance < b.distance
        ? -1
        : a.name > b.name
          ? 1
          : a.name < b.name
            ? -1
            : 0
    );

    return instances;
  }
}
