import { Student } from "src-new/models";
import { RequestFunction } from "../../models/RequestFunction";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/ResponseFunction";
import { Session } from "../../models/Session";
import { TypeHttpDateTime } from "../HttpVariables/TypeHttpDateTime";
import type { PageEmploiDuTempsRequestData, PageEmploiDuTempsRequestSignature, RequestDataIntervals, RequestDataResource, RequestDataWeekNumber } from "./request";
import { Child } from "src-new/models/Users/Parent";
import { PageEmploiDuTempsModel, PageEmploiDuTempsSignature } from "./response";

export type PageEmploiDuTempsResponse = ResponseFunctionWrapper<PageEmploiDuTempsModel, PageEmploiDuTempsSignature>;

export class PageEmploiDuTemps extends RequestFunction<
  PageEmploiDuTempsRequestData,
  PageEmploiDuTempsRequestSignature
> {
  private static readonly name = "PageEmploiDuTemps";

  private readonly decoder = new ResponseFunction(
    this.session,
    PageEmploiDuTempsModel,
    PageEmploiDuTempsSignature
  );

  public constructor(session: Session, private readonly resource: Student | Child) {
    super(session, PageEmploiDuTemps.name);
  }

  private async send(data: RequestDataIntervals | RequestDataWeekNumber): Promise<PageEmploiDuTempsResponse> {
    const resource: RequestDataResource = {
      G: this.resource.kind,
      L: this.resource.name,
      N: this.resource.id
    };

    const response = await this.execute({
      estEDTAnnuel: false,
      estEDTPermanence: false,

      avecAbsencesEleve: false,
      avecRessourcesLibrePiedHoraire: false,

      avecAbsencesRessource: true,
      avecInfosPrefsGrille: true,
      avecConseilDeClasse: true,
      avecCoursSortiePeda: true,
      avecDisponibilites: true,
      avecRetenuesEleve: true,

      edt: { G: 16, L: "Emploi du temps" },

      ressource: resource,
      Ressource: resource,

      ...data
    }, {
      onglet: 16,
      membre: this.resource instanceof Child ? {
        G: this.resource.kind,
        N: this.resource.id
      } : void 0
    });

    return this.decoder.decode(response);
  }

  public sendIntervals(start: Date, end?: Date): Promise<PageEmploiDuTempsResponse> {
    const startV = TypeHttpDateTime.serializer(start);
    const endV = end ? TypeHttpDateTime.serializer(end) : void 0;

    return this.send({
      dateDebut: startV,
      DateDebut: startV,

      ...(endV && ({
        dateFin: endV,
        DateFin: endV
      }))
    });
  }

  public sendWeekNumber(n: number): Promise<PageEmploiDuTempsResponse> {
    return this.send({
      numeroSemaine: n,
      NumeroSemaine: n
    });
  }
}
