import type { TypeHttpHtmlSafe } from "./TypeHttpHtmlSafe";
import type { TypeHttpChaineBrute } from "./TypeHttpChaineBrute";
import type { TypeHttpElement } from "./TypeHttpElement";
import type { TypeHttpDateTime } from "./TypeHttpDateTime";

export enum TypeHttpVariable {
  TypeHttpCategorie = 0,
  TypeHttpCardinal = 1,
  TypeHttpBoolean = 2,
  TypeHttpString = 3,
  TypeHttpColor = 4,
  TypeHttpAlignment_Inutilise = 5,
  TypeHttpFontStyles_Inutilise = 6,
  /** @see {@link TypeHttpDateTime | implementation} */
  TypeHttpDateTime = 7,
  TypeHttpDomaine = 8,
  TypeHttpTraduction = 9,
  TypeHttpNote = 10,
  TypeHttpEnsembleCardinal = 11,
  _TypeHttpLongNote_Inutilise = 12,
  TypeHttpDouble = 13,
  TypeHttpArrondi = 14,
  TypeHttpEnsemble = 15,
  TypeHttpIP = 16,
  TypeHttpUrl = 17,
  TypeHttpSetOf_MrFiche = 18,
  _TypeHttpDoubleNote_Inutilise = 19,
  TypeHttpInteger = 20,
  TypeHttpHtml = 21,
  _TypeHttpJSON_Inutilise = 22,
  /** @see {@link TypeHttpChaineBrute | implementation} */
  TypeHttpChaineBrute = 23,
  /** @see {@link TypeHttpElement | implementation} */
  TypeHttpElement = 24,
  TypeHttpFichierBase64 = 25,
  TypeHttpEnsembleNombre = 26,
  /** @see {@link TypeHttpHtmlSafe | implementation} */
  TypeHttpHtmlSafe = 27
}
