import students_1 from "./students_1.json";
import { describe, it } from "bun:test";
import { ParametresUtilisateurModel } from "../../../src-new/api/ParametresUtilisateur/response";
import { deserialize } from "desero";

describe("ParametresUtilisateur", () => {
  it("should decode [students]", () => {
    const parameters = deserialize(ParametresUtilisateurModel, students_1.data);
    console.log(parameters);
  });
});
