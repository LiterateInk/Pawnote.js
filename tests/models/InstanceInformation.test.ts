import instanceinformation from "@!/instanceinformation.json";
import { describe, expect, it } from "bun:test";
import { deserialize } from "desero";
import { InstanceInformation } from "src-new/models/InstanceInformation";

describe("InstanceInformation", () => {
  it("should deserialize global metadata correctly", () => {
    const instance = deserialize(InstanceInformation, instanceinformation);
    expect(instance.name).toBe("SITE DE DEMONSTRATION");
    expect(instance.version).toEqual([2025, 2, 6]);
  });
});
