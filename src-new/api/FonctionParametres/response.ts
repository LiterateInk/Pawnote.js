import { deserializeWith, rename, t } from "desero";
import { Version } from "src-new/models/Version";
import { TypeHttpElement } from "../HttpVariables/TypeHttpElement";
import { Police } from "../models/Police";
import { TypeHttpChaineBrute } from "../HttpVariables/TypeHttpChaineBrute";
import { MentionsPagesPubliques } from "../models/MentionsPagesPubliques";
import { TypeHttpDateTime } from "../HttpVariables/TypeHttpDateTime";
import { Langue } from "../models/Langue";
import { Domaine, TypeHttpDomaine } from "../HttpVariables/TypeHttpDomaine";
import { TypeHttpEnsembleCardinal } from "../HttpVariables/TypeHttpEnsembleCardinal";
import { EnsembleNombre, TypeHttpEnsembleNombre } from "../HttpVariables/TypeHttpEnsembleNombre";
import { TypeHttpNote } from "../HttpVariables/TypeHttpNote";
import { NiveauAcquisition } from "../models/NiveauAcquisition";
import { Heure } from "../models/Heure";
import { Periode } from "../models/Periode";
import { Recreation } from "../models/Recreation";
import { Collectivite } from "../models/Collectivite";

class General {
  @rename("urlSiteIndexEducation")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public indexEducationUrl = t.string();

  @rename("urlSiteInfosHebergement")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public hostingInformationUrl = t.string();

  @rename("version")
  public versionFullName = t.string();

  @rename("versionPN")
  public versionShortName = t.string();

  @rename("millesime")
  public editionYear = t.string();

  @rename("nomProduit")
  public productName = t.string();

  @rename("langue")
  public language = t.string();

  @rename("langID")
  public languageIdentifier = t.number();

  @rename("listeLangues")
  @deserializeWith(new TypeHttpElement(Langue).deserializer)
  public languages = t.array(t.reference(Langue));

  @rename("publierMentions")
  public publishedNotices = t.boolean();

  @rename("estHebergeEnFrance")
  public isHostedInFrance = t.boolean();

  @rename("avecForum")
  public withForum = t.boolean();

  @rename("UrlAide")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public helpUrl = t.string();

  @rename("urlAccesVideos")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public videosUrl = t.string();

  @rename("urlAccesTwitter")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public twitterUrl = t.string();

  @rename("urlFAQEnregistrementDoubleAuth")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public mfaFaqUrl = t.string();

  @rename("urlTutoVideoSecurite")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public securityVideoTutorialUrl = t.string();

  @rename("urlTutoEnregistrerAppareils")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public saveDevicesTutorialUrl = t.string();

  @rename("urlCanope")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public canopeUrl = t.string();

  @rename("accessibiliteNonConforme")
  public isAccessibilityNonCompliant = t.boolean();

  @rename("urlDeclarationAccessibilite")
  public accessibilityDeclarationUrl = t.string();

  @rename("AvecChoixConnexion")
  public withLoginChoice = t.boolean();

  @rename("NomEtablissement")
  public schoolName = t.string();

  @rename("NomEtablissementConnexion")
  public loginSchoolName = t.string();

  @rename("numeroPremiereSemaine")
  public firstWeekIndex = t.number();

  @rename("AnneeScolaire")
  public schoolYear = t.string();

  @rename("dateDebutPremierCycle")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public firstCycleStartDate = t.instance(Date);

  @rename("PremierLundi")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public firstMondayDate = t.instance(Date);

  @rename("PremiereDate")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public firstDate = t.instance(Date);

  @rename("DerniereDate")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public lastDate = t.instance(Date);

  @rename("PlacesParJour")
  public slotsPerDay = t.number();

  @rename("PlacesParHeure")
  public slotsPerHour = t.number();

  @rename("DureeSequence")
  public sequenceDuration = t.number();

  @rename("PlaceDemiJourneeAbsence")
  public halfDayAbsenceSlot = t.number();

  @rename("saisirAbsencesParDJ")
  public inputAbsencePerHalfDay = t.number();

  @rename("valeurDefautPresenceDispense")
  public defaultPresenceExemptionValue = t.boolean();

  @rename("activationDemiPension")
  public isHalfBoardEnabled = t.boolean();

  @rename("debutDemiPension")
  public halfBoardStart = t.number();

  @rename("finDemiPension")
  public halfBoardEnd = t.number();

  @rename("AvecHeuresPleinesApresMidi")
  public withFullAfternoonHours = t.boolean();

  @rename("JourOuvre")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public openingDate = t.instance(Date);

  @rename("JoursOuvres")
  @deserializeWith(TypeHttpEnsembleCardinal.deserializer)
  public weekdays = t.array(t.number());

  @rename("JoursDemiPension")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public halfBoardDays = t.array(t.number());

  @rename("ActivationMessagerieEntreParents")
  public isParentMessagingEnabled = t.boolean();

  @rename("GestionParcoursExcellence")
  public manageExcellenceProgram = t.boolean();

  @rename("activerBlog")
  public enableBlog = t.boolean();

  @rename("joursOuvresParCycle")
  public workingDaysPerCycle = t.number();

  @rename("premierJourSemaine")
  public firstDayOfWeek = t.number();

  @rename("grillesEDTEnCycle")
  public timetableGridsPerCycle = t.number();

  @rename("setOfJoursCycleOuvre")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public setOfWorkingDaysPerCycle = t.array(t.number());

  @rename("DemiJourneesOuvrees")
  @deserializeWith((value: Array<EnsembleNombre>) => value.map(TypeHttpEnsembleNombre.deserializer))
  public workingHalfDays = t.array(t.array(t.number()));

  @rename("DomainesFrequences")
  @deserializeWith((value: Array<Domaine>) => value.map(TypeHttpDomaine.deserializer))
  public frequenciesDomains = t.array(t.array(t.number()));

  @rename("LibellesFrequences")
  public frequenciesLabels = t.array(t.string());

  @rename("BaremeNotation")
  @deserializeWith(TypeHttpNote.deserializer)
  public gradingScale = t.instance(TypeHttpNote);

  @rename("BaremeMaxDevoirs")
  @deserializeWith(TypeHttpNote.deserializer)
  public maxAssignmentScale = t.instance(TypeHttpNote);

  @rename("NbJDecalageDatePublicationParDefaut")
  public defaultPublicationOffsetDays = t.number();

  @rename("NbJDecalagePublicationAuxParents")
  public defaultPublicationToParentsOffsetDays = t.number();

  @rename("AvecAffichageDecalagePublicationNotesAuxParents")
  public withParentGradePublicationDelayDisplay = t.boolean();

  @rename("AvecAffichageDecalagePublicationEvalsAuxParents")
  public withParentExamsPublicationDelayDisplay = t.boolean();

  /**
   * Should be used on {@link Grade} to know which
   * grade annotations are allowed on this instance.
   *
   * @see
   *
   * ```
   * // Parametres.js [class ObjetParametres#constructor]
   * TypeNote.listeAnnotationsAutorisees = lJGeneral.listeAnnotationsAutorisees;
   * ```
   */
  @rename("listeAnnotationsAutorisees")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public allowedAnnotationsTypes = t.array(t.number());

  @rename("ListeNiveauxDAcquisitions")
  @deserializeWith(new TypeHttpElement(NiveauAcquisition).deserializer)
  public skillLevels = t.array(t.reference(NiveauAcquisition));

  @rename("AfficherAbbreviationNiveauDAcquisition")
  public showAcquisitionLevelAbbreviation = t.boolean();

  @rename("AvecEvaluationHistorique")
  public withExamsHistory = t.boolean();

  @rename("SansValidationNivIntermediairesDsValidAuto")
  public skipIntermediateLevelValidationInAutoValidation = t.boolean();

  @rename("NeComptabiliserQueEvalsAnneeScoDsValidAuto")
  public countOnlySchoolYearExamsInAutoValidation = t.boolean();

  @rename("PondererMatieresSelonLeurCoeffDsDomaine")
  public weightSubjectsByDomainCoefficient = t.boolean();

  @rename("AvecGestionNiveauxCECRL")
  public withCEFRLevelManagement = t.boolean();

  @rename("couleurActiviteLangagiere")
  public languageActivityColor = t.string();

  @rename("minBaremeQuestionQCM")
  public minMultipleChoiceQuestionScore = t.number();

  @rename("maxBaremeQuestionQCM")
  public maxMultipleChoiceQuestionScore = t.number();

  @rename("maxNbPointQCM")
  public maxMultipleChoicePoints = t.number();

  @rename("maxNiveauQCM")
  public maxMultipleChoiceLevel = t.number();

  @rename("tailleLibelleElementGrilleCompetence")
  public skillGridElementLabelLength = t.number();

  @rename("tailleCommentaireDevoir")
  public assignmentCommentLength = t.number();

  @rename("AvecRecuperationInfosConnexion")
  public withLoginInfoRetrieval = t.boolean();

  @rename("parentAutoriseChangerMDP")
  public isParentAllowedToChangePassword = t.boolean();

  @rename("Police")
  public fontName = t.string();

  @rename("TaillePolice")
  public fontSize = t.number();

  @rename("AvecElevesRattaches")
  public withAttachedStudents = t.boolean();

  @rename("maskTelephone")
  public phoneNumberMask = t.string();

  public maxECTS = t.number();

  @rename("TailleMaxAppreciation")
  public maxCommentLength = t.array(t.number());

  // TODO: find test data for this!
  // public listeJoursFeries = t.array();

  public afficherSequences = t.boolean();

  @rename("PremiereHeure")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public epoch = t.instance(Date);

  @rename("ListeHeures")
  @deserializeWith(new TypeHttpElement(Heure).deserializer)
  public startingHours = t.array(t.reference(Heure));

  @rename("ListeHeuresFin")
  @deserializeWith(new TypeHttpElement(Heure).deserializer)
  public endingHours = t.array(t.reference(Heure));

  @rename("ListeHeuresFinPourVS")
  @deserializeWith(new TypeHttpElement(Heure).deserializer)
  public endingHoursForStaff = t.array(t.reference(Heure));

  public sequences = t.array(t.string());

  @rename("ListePeriodes")
  public periods = t.array(t.reference(Periode));

  @rename("recreations")
  @deserializeWith(new TypeHttpElement(Recreation).deserializer)
  public breaks = t.array(t.reference(Recreation));

  @rename("tailleMaxEnregistrementAudioRenduTAF")
  public maxAssignmentSubmissionAudioFileSize = t.number();

  @rename("genresRenduTAFValable")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public allowedAssignmentSubmissionTypes = t.array(t.number());

  @rename("nomCookieAppli")
  public applicationCookieName = t.string();

  // NOTE: let's ignore `aideContextuelle`, whoever cares about those values...

  @rename("Collectivite")
  public localAuthority = t.reference(Collectivite);
}

export class FonctionParametresModel {
  @rename("identifiantNav")
  public navigatorIdentifier = t.option(t.string());

  @rename("estAfficheDansENT")
  public isDisplayedInENT = t.string();

  @deserializeWith(new TypeHttpElement(Police).deserializer)
  @rename("listePolices")
  public fonts = t.array(t.reference(Police));

  @rename("avecMembre")
  public withMember = t.boolean();

  @rename("pourNouvelleCaledonie")
  public forNewCaledonia = t.boolean();

  @rename("genreImageConnexion")
  public loginImageType = t.number(); // TODO: find ENUM

  @rename("urlImageConnexion")
  public loginImageUrl = t.string();

  @rename("tableauVersion")
  public version: Version = t.array(t.number());

  @rename("logoProduitCss")
  public productLogoCSS = t.string();

  @rename("labelLienProduit")
  public productLinkLabel = t.string();

  @rename("urlConfidentialite")
  @deserializeWith(TypeHttpChaineBrute.deserializer)
  public privacyPolicyUrl = t.string();

  @rename("mentionsPagesPubliques")
  public publicPagesNotices = t.reference(MentionsPagesPubliques);

  @rename("DateServeurHttp")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public serverDateTime = t.instance(Date);

  @rename("DateDemo")
  @deserializeWith(TypeHttpDateTime.deserializer)
  public demoDateTime = t.option(t.instance(Date));

  @rename("URLEspace")
  public webspaceUrl = t.string();

  @rename("Nom")
  public webspaceName = t.string();

  @rename("General")
  public general = t.reference(General);
}

export class FonctionParametresSignature {
  @rename("ModeExclusif")
  public exclusive = t.boolean();
}
