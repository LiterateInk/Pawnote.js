import parents_1 from "./parents_1.json";
import students_1 from "./students_1.json";
import students_2 from "./students_2.json";
import students_3 from "./students_3.json";
import students_4 from "./students_4.json";

import { PageEmploiDuTempsModel, Visio } from "~/api/PageEmploiDuTemps/response";
import { describe, expect, it } from "bun:test";
import { deserialize } from "desero";

describe("PageEmploiDuTemps", () => {
  it("should decode [parents]", () => {
    const parameters = deserialize(PageEmploiDuTempsModel, parents_1.data);
    console.log(parameters);
  });

  it("should decode [students 1]", () => {
    const parameters = deserialize(PageEmploiDuTempsModel, students_1.data);
    console.log(parameters);
  });

  it("should decode [students 2]", () => {
    const parameters = deserialize(PageEmploiDuTempsModel, students_2.data);
    console.log(parameters);
  });

  describe("listeVisios", () => {

    it("should decode with only url [students_3.json]", () => {
      const parameters = deserialize(PageEmploiDuTempsModel, students_3.data);
      const cours = parameters.ListeCours[4];
      expect(cours.listeVisios).not.toBeNull();
      expect(cours.listeVisios).toBeArrayOfSize(1);

      const visio = cours.listeVisios![0];
      expect(visio).toBeInstanceOf(Visio);

      expect(visio.n).toBe("178#2Afm6Bndr27sKNpEopWhLkfaTzeVeEO00uVnJ03Z08k");
      expect(visio.url).toBe("https://github.com/Vexcited");
    });

    it("should decode with all optional parameters [students_4.json]", () => {
      const parameters = deserialize(PageEmploiDuTempsModel, students_4.data);
      const cours = parameters.ListeCours[4];
      expect(cours.listeVisios).not.toBeNull();
      expect(cours.listeVisios).toBeArrayOfSize(1);

      const visio = cours.listeVisios![0];
      expect(visio).toBeInstanceOf(Visio);

      expect(visio.n).toBe("178#dBLsGWwn09AlxlCJd-ciSocCNojo3JujChkgAQUIo4k");
      expect(visio.url).toBe("https://github.com/Vexcited");
      expect(visio.commentaire).toBe("Hello, World!");
      expect(visio.libelleLien).toBe("My GitHub!");
    });
  });
});
