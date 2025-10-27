import students_1 from "./students_1.json";
import parents_1 from "./parents_1.json";

import { FonctionParametresModel } from "../../../src-new/api/FonctionParametres/response";
import { describe, it } from "bun:test";
import { deserialize } from "desero";

describe("FonctionParametres", () => {
  it("should decode [students]", () => {
    const parameters = deserialize(FonctionParametresModel, students_1.data);
    // console.log(parameters);
  });

  it("should decode [parents]", () => {
    const parameters = deserialize(FonctionParametresModel, parents_1.data);
    console.log(parameters);
  });
});
