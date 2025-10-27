import { deserializeWith, rename, t } from "desero";
import { TypeHttpElement } from "../HttpVariables/TypeHttpElement";

export class Onglet {
  @rename("G")
  public id = t.number();
  @rename("Onglet")
  public children = t.option(t.array(t.reference(Onglet)));
}

export class ParametresUtilisateurEDT {
  public afficherCoursAnnules = t.boolean();
  public axeInverseEDT = t.boolean();
  public axeInversePlanningHebdo = t.boolean();
  public axeInversePlanningJour = t.boolean();
  public axeInversePlanningJour2 = t.boolean();
  public nbJours = t.number();
  public nbRessources = t.number();
  public nbJoursEDT = t.number();
  public nbSequences = t.number();
}

export class ParametresUtilisateurCommunication {
  public DiscussionNonLues = t.boolean();
}

export class ParametresUtilisateur {
  public version = t.number();
  public EDT = t.reference(ParametresUtilisateurEDT);
  public Communication = t.reference(ParametresUtilisateurCommunication);
}

export class InformationEtablissementCoordonnees {
  public Adresse1 = t.string();
  public Adresse2 = t.string();
  public Adresse3 = t.string();
  public Adresse4 = t.string();
  public CodePostal = t.string();
  public LibellePostal = t.string();
  public LibelleVille = t.string();
  public Province = t.string();
  @rename("Pays")
  public country = t.string();
  @rename("SiteInternet")
  public website = t.string();
}

export class InformationEtablissement {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
  // TODO: `urlLogo` (23)
  public Coordonnees = t.reference(InformationEtablissementCoordonnees);
  public avecInformations = t.boolean();
}

export class AutorisationsSessionFonctionnalites {
  gestionTwitter = t.boolean();
  attestationEtendue = t.boolean();
  gestionARBulletins = t.boolean();
}

export class AutorisationsSession {
  fonctionnalites = t.reference(AutorisationsSessionFonctionnalites);
}

export class AutorisationsCompte {
  avecSaisieMotDePasse = t.boolean();
  avecInformationsPersonnelles = t.boolean();
}

export class Autorisations {
  AvecDiscussion = t.boolean();
  AvecDiscussionPersonnels = t.boolean();
  AvecDiscussionProfesseurs = t.boolean();
  AvecDiscussionParents = t.option(t.boolean());
  AvecSaisieObservationsParents = t.option(t.boolean());
  accesDecrochage = t.option(t.boolean());

  // TODO: incidents
  // TODO: intendance
  // TODO: services
  // TODO: cours

  tailleMaxDocJointEtablissement = t.number();
  tailleMaxRenduTafEleve = t.option(t.number());
  tailleTravailAFaire = t.number();
  tailleCirconstance = t.number();
  tailleCommentaire = t.number();
  consulterDonneesAdministrativesAutresEleves = t.boolean();
  compte = t.reference(AutorisationsCompte);
  autoriserImpressionBulletinReleveBrevet = t.boolean();
}

export class MotifAbsence {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
}

export class MotifRetard {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
}

export class ParametresUtilisateurModel {
  @rename("ressource")
  public resource = t.reference(Ressource);

  @deserializeWith(new TypeHttpElement(InformationEtablissement).array)
  public listeInformationsEtablissements = t.array(t.reference(InformationEtablissement));

  @deserializeWith(new TypeHttpElement(MotifAbsence).array)
  public listeMotifsAbsences = t.option(t.array(t.reference(MotifAbsence)));

  @deserializeWith(new TypeHttpElement(MotifRetard).array)
  public listeMotifsRetards = t.option(t.array(t.reference(MotifRetard)));

  public parametresUtilisateur = t.reference(ParametresUtilisateur);

  public autorisationsSession = t.reference(AutorisationsSession);

  public autorisations = t.reference(Autorisations);

  // TODO: `tabEtablissementsModeleGrille` ?

  public listeOnglets = t.array(t.reference(Onglet));
  public listeOngletsInvisibles = t.array(t.number());
  public listeOngletsNotification = t.array(t.number());
}

export class Etablissement {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
}

export class ClasseEleve {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
}

export class ClasseHistorique {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
  @rename("courant")
  public current = t.boolean();
  @rename("AvecNote")
  public withGrades = t.boolean();
  @rename("AvecFiliere")
  public withSector = t.boolean();
}

export class Groupe {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
}

export class Service {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
}

export class Pilier {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
  @rename("G")
  public kind = t.number();
  @rename("P")
  public position = t.number();
  public estPilierLVE = t.boolean();
  public estSocleCommun = t.option(t.boolean());
  @rename("Service")
  @deserializeWith(new TypeHttpElement(Service).single)
  public service = t.option(t.reference(Service));
}

export class Palier {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
  @rename("G")
  public kind = t.number();
  @deserializeWith(new TypeHttpElement(Pilier).array)
  public listePiliers = t.array(t.reference(Pilier));
}

export class OngletPourPilier {
  @rename("G")
  public tab = t.number();

  @deserializeWith(new TypeHttpElement(Palier).array)
  public listePaliers = t.array(t.reference(Palier));
}

export class PeriodeParDefaut {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.string();
}

export class Periode {
  @rename("L")
  public name = t.string();
  @rename("N")
  public id = t.option(t.string());
  @rename("G")
  public kind = t.number(); // TODO: find enum
  @rename("A")
  public active = t.option(t.boolean());
  @rename("GenreNotation")
  public grading = t.option(t.number());
}

export class OngletPourPeriode {
  @rename("G")
  public tab = t.number();

  @rename("listePeriodes")
  @deserializeWith(new TypeHttpElement(Periode).array)
  public periods = t.array(t.reference(Periode));

  @rename("periodeParDefaut")
  @deserializeWith(new TypeHttpElement(PeriodeParDefaut).single)
  public defaultPeriod = t.reference(PeriodeParDefaut);
}

export class NumeroUtile {
  // TODO
}

export class InnerResource {
  @rename("L")
  public name = t.string();

  @rename("N")
  public id = t.string();

  @rename("G")
  public kind = t.number();

  @rename("P")
  public position = t.number();

  @rename("Etablissement")
  @deserializeWith(new TypeHttpElement(Etablissement).single)
  public school = t.reference(Etablissement);

  @rename("classeDEleve")
  public studentClass = t.reference(ClasseEleve);

  public estClasseRattachementduJour = t.boolean();

  @rename("listeClassesHistoriques")
  @deserializeWith(new TypeHttpElement(Etablissement).array)
  public studentClassesHistory = t.array(t.reference(Etablissement));

  @rename("listeGroupes")
  @deserializeWith(new TypeHttpElement(Groupe).array)
  public groups = t.array(t.reference(Groupe));

  @deserializeWith(new TypeHttpElement(OngletPourPilier).array)
  public listeOngletsPourPiliers = t.array(t.reference(OngletPourPilier));

  @deserializeWith(new TypeHttpElement(OngletPourPeriode).array)
  public listeOngletsPourPeriodes = t.array(t.reference(OngletPourPeriode));

  // TODO: `listeMatieresDeclarationDispense` (24 / .array)
}

export class Ressource {
  @rename("L")
  public name = t.string();

  @rename("N")
  public id = t.string();

  @rename("G")
  public kind = t.number();

  @rename("listeRessources")
  public inner = t.option(t.array(t.reference(InnerResource)));

  @rename("P")
  public position = t.option(t.number());

  @rename("Etablissement")
  @deserializeWith(new TypeHttpElement(Etablissement).single)
  public school = t.option(t.reference(Etablissement));

  @rename("classeDEleve")
  public studentClass = t.option(t.reference(ClasseEleve));

  public estClasseRattachementduJour = t.option(t.boolean());

  @rename("listeClassesHistoriques")
  @deserializeWith(new TypeHttpElement(Etablissement).array)
  public studentClassesHistory = t.option(t.array(t.reference(Etablissement)));

  @rename("listeGroupes")
  @deserializeWith(new TypeHttpElement(Groupe).array)
  public groups = t.option(t.array(t.reference(Groupe)));

  @deserializeWith(new TypeHttpElement(OngletPourPilier).array)
  public listeOngletsPourPiliers = t.option(t.array(t.reference(OngletPourPilier)));

  @deserializeWith(new TypeHttpElement(OngletPourPeriode).array)
  public listeOngletsPourPeriodes = t.option(t.array(t.reference(OngletPourPeriode)));

  public estDelegue = t.option(t.boolean());
  public estMembreCA = t.option(t.boolean());
  public avecDiscussionResponsables = t.option(t.boolean());

  @deserializeWith(new TypeHttpElement(NumeroUtile).array)
  public listeNumerosUtiles = t.array(t.reference(NumeroUtile));
}

export class Notifications {
  compteurCentraleNotif = t.number();
}

export class NotificationCommuniction {
  @rename("onglet")
  tab = t.number();

  @rename("nb")
  count = t.number();
}

export class ParametresUtilisateurSignature {
  public notifications = t.reference(Notifications);
  public notificationsCommunication = t.array(t.reference(NotificationCommuniction));
  public actualisationMessage = t.boolean();
}
