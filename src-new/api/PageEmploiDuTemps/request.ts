type PageEmploiDuTempsRequestDataBase = {
  estEDTAnnuel: boolean
  estEDTPermanence: boolean
  avecAbsencesEleve: boolean
  avecRessourcesLibrePiedHoraire: boolean
  avecAbsencesRessource: boolean
  avecInfosPrefsGrille: boolean
  avecConseilDeClasse: boolean
  avecCoursSortiePeda: boolean
  avecDisponibilites: boolean
  avecRetenuesEleve: boolean
  edt: { G: 16, L: "Emploi du temps" }

  ressource: RequestDataResource
  Ressource: RequestDataResource
};

export interface RequestDataResource {
  G: number
  L: string
  N: string
}

export interface RequestDataIntervals {
  dateDebut: {
    _T: 7
    V: string
  }
  DateDebut: {
    _T: 7
    V: string
  }
  dateFin?: {
    _T: 7
    V: string
  }
  DateFin?: {
    _T: 7
    V: string
  }
}

export interface RequestDataWeekNumber {
  numeroSemaine: number
  NumeroSemaine: number
}

export type PageEmploiDuTempsRequestData = PageEmploiDuTempsRequestDataBase & (
  | RequestDataIntervals
  | RequestDataWeekNumber
);


export interface PageEmploiDuTempsRequestSignature {
  onglet: 16; // TODO: find enum
  membre?: {
    G: number
    N: string
  }
}
