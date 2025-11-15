import { TypeOrigineCreationCategorieCahierDeTexte } from "~/api/models/TypeOrigineCreationCategorieCahierDeTexte";
import { OrigineCategorie } from "~/api/PageEmploiDuTemps/response";

export class LessonCategory {
  /** @internal */
  public constructor(
    private categorie: OrigineCategorie
  ) {}

  // TODO: refactor this type
  public get origin(): TypeOrigineCreationCategorieCahierDeTexte {
    return this.categorie.g;
  }

  public get name(): string {
    return this.categorie.l;
  }

  public get label(): string {
    return this.categorie.libelleIcone;
  }

  public get test(): boolean {
    return this.categorie.g === TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir
        || this.categorie.g === TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation;
  }
}
