import { dataSec as students_1 } from "./students_1.json";
import { describe, expect, it } from "bun:test";
import { FonctionParametresModel } from "../../src-new/api/FonctionParametres/response";
import { deserialize } from "desero";

describe("FonctionParametres", () => {
  it("should decode [students]", () => {
    const parameters = deserialize(FonctionParametresModel, students_1.data);
    console.log(parameters);
  });
});
