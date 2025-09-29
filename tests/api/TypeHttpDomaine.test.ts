import { describe, it, expect } from "bun:test";
import { TypeHttpDomaine } from "../../src-new/api/HttpVariables/TypeHttpDomaine";

describe("TypeHttpDomaine", () => {
  it("should create a new domain", () => {
    const domain = new TypeHttpDomaine();
    domain.setValue(true, 2, 7);
    domain.setValue(false, 4, 6);
    expect(domain.getWeeks()).toEqual([2, 3, 7]);
  });
});
