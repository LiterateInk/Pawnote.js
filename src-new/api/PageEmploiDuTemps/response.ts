import { deserializeWith, rename, t } from "desero";
import { TypeHttpElement } from "../HttpVariables/TypeHttpElement";
import { TypeHttpDateTime } from "../HttpVariables/TypeHttpDateTime";

export class Contenu {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.option(t.string());
  @rename("G")
  public kind = t.number();
}

export class CahierDeTextes {
  @rename("N")
  public id = t.string();
  // TODO: originesCategorie
}

export class Cours {
  @rename("N")
  public id = t.string();
  @rename("G")
  public kind = t.number();
  public P = t.number();
  @rename("place")
  public slot = t.number();
  @rename("duree")
  public duration = t.number();
  @rename("CouleurFond")
  public color = t.string();
  public AvecTafPublie = t.boolean();
  public AvecCdT = t.option(t.boolean());
  @deserializeWith(new TypeHttpElement(Contenu).array)
  public ListeContenus = t.array(t.reference(Contenu));
  @deserializeWith(TypeHttpDateTime.deserializer)
  public DateDuCours = t.instance(Date);
}

export class Recreation {
  @rename("L")
  public name = t.string();
  public place = t.number();
}

export class IconePeriodeDemiPension {
  public text = t.string();
  public check = t.boolean();
}

export class PeriodeDemiPension {
  public icone = t.reference(IconePeriodeDemiPension);
  public hint = t.string();
}

export class DemiPension {
  public midi = t.option(t.reference(PeriodeDemiPension));
}

export class JourCycle {
  public jourCycle = t.number();
  public numeroSemaine = t.number();
  public DP = t.reference(DemiPension);
}

export class Absences {
  @deserializeWith(new TypeHttpElement(JourCycle).array)
  public joursCycle = t.array(t.reference(JourCycle));
}

export class PrefsGrille {
  public genreRessource = t.number();
}

export class PageEmploiDuTempsModel {
  public jourCycleSelectionne = t.number();
  public avecCoursAnnule = t.boolean();
  public prefsGrille = t.reference(PrefsGrille);
  public ListeCours = t.array(t.reference(Cours));
  public premierePlaceHebdoDuJour = t.number();
  public debutDemiPensionHebdo = t.number();
  public finDemiPensionHebdo = t.number();
  public absences = t.reference(Absences);
  @deserializeWith(new TypeHttpElement(Recreation).array)
  public recreations = t.array(t.reference(Recreation));
}
