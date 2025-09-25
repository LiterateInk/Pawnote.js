import { Instance } from "./Instance";
import { Webspace } from "./Webspace";

export class Login {
  public constructor (
    private readonly instance: Instance
  ) {}

  public async initializeWithCredentials(
    webspace: Webspace,
    username: string,
    password: string,
    deviceUUID = crypto.randomUUID() as string,
    navigatorIdentifier: string | null = null
  ) {
    const { version } = await this.instance.getInformation();

    // base,
    // kind: auth.kind,
    // cookies: [], // none
    // params: {
    //   ...BASE_PARAMS,
    //   // bypasss delegation
    //   bydlg: "A6ABB224-12DD-4E31-AD3E-8A39A1C2C335"
    // }

    const information = await this.getWebspaceHomepage(webspace);
  }

  private async getWebspaceHomepage(webspace: Webspace, params = new URLSearchParams(), cookies: string[] = []) {
    params.set("fd", "1");
    const url = this.instance.base + "/" + Webspace.toMobilePath(webspace) + "?" + params.toString();


  }
}
