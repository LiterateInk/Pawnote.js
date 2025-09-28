import { describe, it, expect } from "bun:test";
import { Instance } from "src-new";

describe("Instance.base", () => {
  it("should convert webspace to base", () => {
    const manager = Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
    expect(manager.base).toBe("https://demo.index-education.net/pronote");
  });

  it("should keep as is", () => {
    const manager = Instance.fromURL("https://demo.index-education.net/pronote");
    expect(manager.base).toBe("https://demo.index-education.net/pronote");
  });

  it("should keep as is without the trailing slash", () => {
    const manager = Instance.fromURL("https://demo.index-education.net/pronote/");
    expect(manager.base).toBe("https://demo.index-education.net/pronote");
  });

  it("should handle custom origins with no prefix", () => {
    const manager = Instance.fromURL("http://dev:1234/");
    expect(manager.base).toBe("http://dev:1234");
  });

  it("should handle custom origins with very long prefixes", () => {
    const manager = Instance.fromURL("http://dev:1234/a/b/c/d/e/eleve.html");
    expect(manager.base).toBe("http://dev:1234/a/b/c/d/e");
  });

  it("should remove any query parameter or fragment on root", () => {
    const manager = Instance.fromURL("http://demo/pronote?login=true#value=1");
    expect(manager.base).toBe("http://demo/pronote");
  });

  it("should remove any query parameter or fragment on webspace", () => {
    const manager = Instance.fromURL("http://demo/pronote/eleve.html?login=true#value=1");
    expect(manager.base).toBe("http://demo/pronote");
  });
});
