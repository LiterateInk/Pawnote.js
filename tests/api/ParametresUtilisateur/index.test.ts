import students_1 from "./students_1.json";
import parents_1 from "./parents_1.json";
import parents_2 from "./parents_2.json";

import { ParametresUtilisateurModel } from "../../../src-new/api/ParametresUtilisateur/response";
import { describe, it } from "bun:test";
import { deserialize } from "desero";

describe("ParametresUtilisateur", () => {
  it("should decode [students]", () => {
    const parameters = deserialize(ParametresUtilisateurModel, students_1.data);
    // console.dir(parameters, { depth: Infinity });
  });

  it("should decode [parents 1]", () => {
    const parameters = deserialize(ParametresUtilisateurModel, parents_1.data);
    // console.dir(parameters, { depth: Infinity });
  });

  it("should decode [parents 2]", () => {
    const parameters = deserialize(ParametresUtilisateurModel, parents_2.data);
    console.dir(parameters, { depth: Infinity });
  });
});
