import { deserializeWith, rename, t } from "desero";
import { TypeHttpElement } from "../HttpVariables/TypeHttpElement";
import { TypeHttpDateTime } from "../HttpVariables/TypeHttpDateTime";
import { TypeOrigineCreationCategorieCahierDeTexte } from "../models/TypeOrigineCreationCategorieCahierDeTexte";
import { TypeHttpChaineBrute } from "../HttpVariables/TypeHttpChaineBrute";

export class Contenu {
  @rename("L")
  public l = t.string();
  @rename("N")
  public n = t.option(t.string());
  @rename("G")
  public g = t.option(t.number());

  public estHoraire = t.option(t.boolean());
  public estServiceGroupe = t.option(t.boolean());
}

export class OrigineCategorie {
  @rename("G")
  public g = t.enum(TypeOrigineCreationCategorieCahierDeTexte);
  @rename("L")
  public l = t.string();
  public libelleIcone = t.string();
}

export class CahierDeTextes {
  @rename("N")
  public n = t.string();
  public estDevoir = t.option(t.boolean());
  @deserializeWith(new TypeHttpElement(OrigineCategorie).array)
  public originesCategorie = t.array(t.reference(OrigineCategorie));
}

export class Visio {
  @rename("N")
  public n = t.string();
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public url = t.string();
  public libelleLien = t.option(t.string());
  public commentaire = t.option(t.string());
}

export class Cours {
  @rename("N")
  public n = t.string();

  @rename("G")
  public g = t.number();

  @rename("P")
  public p = t.number();

  public place = t.number();
  public duree = t.number();

  @rename("CouleurFond")
  public couleurFond = t.option(t.string());

  @rename("AvecTafPublie")
  public avecTafPublie = t.boolean();

  @rename("AvecCdT")
  public avecCdt = t.option(t.boolean());
  @deserializeWith(new TypeHttpElement(CahierDeTextes).single)
  public cahierDeTextes = t.option(t.reference(CahierDeTextes));

  @deserializeWith(new TypeHttpElement(Visio).array)
  public listeVisios = t.option(t.array(t.reference(Visio)));

  @rename("Statut")
  public statut = t.option(t.string());

  @rename("ListeContenus")
  @deserializeWith(new TypeHttpElement(Contenu).array)
  public listeContenus = t.array(t.reference(Contenu));

  @rename("DateDuCours")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public dateDuCours = t.instance(Date);

  @rename("DateDuCoursFin")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public dateDuCoursFin = t.option(t.instance(Date));

  public estSortiePedagogique = t.option(t.boolean());
  public estRetenue = t.option(t.boolean());
  public memo = t.option(t.string());

  // Might be only for lessons.
  public estAnnule = t.option(t.boolean());
  public dispenseEleve = t.option(t.boolean());

  // Will always be available for activities.
  public accompagnateurs = t.option(t.array(t.string()));
  public strGenreRess = t.option(t.string());
  public strRess = t.option(t.string());
  public motif = t.option(t.string());
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
  @rename("DP")
  public dp = t.option(t.reference(DemiPension));
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
