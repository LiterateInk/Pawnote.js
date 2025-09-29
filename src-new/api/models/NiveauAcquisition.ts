import { deserializeWith, rename, t } from "desero";
import { TypeHttpEnsembleNombre } from "../HttpVariables/TypeHttpEnsembleNombre";
import { TypeHttpElement } from "../HttpVariables/TypeHttpElement";
import { Note, TypeHttpNote } from "../HttpVariables/TypeHttpNote";

class Position {
  @rename("G")
  public kind = t.number();
  @rename("L")
  public title = t.string();
  public abbreviation = t.string();
  @rename("abbreviationAvecPrefixe")
  public abbreviationWithPrefix = t.option(t.string());
}

export class NiveauAcquisition {
  @rename("L")
  public title = t.string();
  @rename("N")
  public id = t.string();
  @rename("G")
  public kind = t.number();
  public P = t.number();

  @rename("listePositionnements")
  @deserializeWith(new TypeHttpElement(Position).deserializer)
  public positions = t.array(t.reference(Position));

  @rename("positionJauge")
  public positionJauge = t.number();

  @rename("actifPour")
  @deserializeWith(TypeHttpEnsembleNombre.deserializer)
  public activeFor = t.array(t.number());

  public abbreviation = t.string();

  @rename("couleur")
  public color = t.option(t.string());

  @rename("ponderation")
  @deserializeWith((value?: Note) => value && TypeHttpNote.deserializer(value))
  public weight = t.option(t.instance(TypeHttpNote));

  @rename("nombrePointsBrevet")
  @deserializeWith((value?: Note) => value && TypeHttpNote.deserializer(value))
  public brevetPoints = t.option(t.instance(TypeHttpNote));

  @rename("estAcqui")
  public isAcquired = t.option(t.boolean());

  @rename("estNonAcqui")
  public isNotAcquired = t.option(t.boolean());

  @rename("estNotantPourTxReussite")
  public affectsSuccessRate = t.option(t.boolean());

  @rename("raccourci")
  public shortcut = t.string();

  @rename("raccourciPositionnement")
  public shortcutPosition = t.option(t.string());
}
