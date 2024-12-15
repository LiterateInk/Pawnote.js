import type { ResourceContent, SessionHandle } from "~/models";
import { decodeAssignmentTheme } from "./assignment-theme";
import { decodeAttachment } from "./attachment";

export const decodeResourceContent = (content: any, session: SessionHandle): ResourceContent => {
  return {
    id: content.N,
    title: content.L,
    description: content.descriptif.V,
    category: content.categorie.V.G,
    categoryText: content.category.V.L,
    files: content.ListePieceJointe.V.map((attachment: any) => decodeAttachment(attachment, session)),
    themes: content.ListeThemes.V.map((theme: any) => decodeAssignmentTheme(theme)),
    // TODO: Investigate to see what is contained here when not `-1`.
    educativeValue: content.parcoursEducatif
  };
};
