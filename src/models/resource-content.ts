import type { ResourceContentCategory } from "./resource-content-category";
import type { AssignmentTheme } from "./assignment-theme";
import type { Attachment } from "./attachment";

export type ResourceContent = Readonly<{
  id: string;

  /**
   * @remark Optional because teachers can just write nothing here and only give a description.
   */
  title?: string;
  /**
   * An HTML string to preserve all the formatting done in the UI.
   * @remark Optional because teachers can just write the title with no description.
   */
  description?: string;

  category: ResourceContentCategory;
  categoryText?: string;
  files: Attachment[];
  /** Themes associated with the lesson. */
  themes: AssignmentTheme[];

  /** `-1` when not defined. */
  educativeValue: number;
}>;
