import parents_1 from "./parents_1.json";

import { PageEmploiDuTempsModel } from "~/api/PageEmploiDuTemps/response";
import { describe, it } from "bun:test";
import { deserialize } from "desero";

describe("PageEmploiDuTemps", () => {
  it("should decode [parents]", () => {
    const parameters = deserialize(PageEmploiDuTempsModel, parents_1.data);
    console.log(parameters);
  });
});
