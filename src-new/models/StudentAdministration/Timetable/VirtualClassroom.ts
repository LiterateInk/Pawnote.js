import { Visio } from "~/api/PageEmploiDuTemps/response";

export class VirtualClassroom {
  /** @internal */
  public constructor(
    private visio: Visio
  ) {}

  public get url(): string {
    return this.visio.url;
  }

  public get name(): string | null {
    return this.visio.libelleLien;
  }

  public get details(): string | null {
    return this.visio.commentaire;
  }
}
