export interface IdentificationRequest {
  // TODO: find proper enum
  // NOTE: only teachers can have a different one, apparently!
  genreConnexion: number
  genreEspace: number
  identifiant: string
  pourENT: boolean
  enConnexionAuto: boolean
  demandeConnexionAuto: boolean
  enConnexionAppliMobile: boolean
  demandeConnexionAppliMobile: boolean
  demandeConnexionAppliMobileJeton: boolean
  uuidAppliMobile: string
  loginTokenSAV: string

  informationsAppareil: {
    modele: string // iPhone 17
    platforme: string
  }
}
