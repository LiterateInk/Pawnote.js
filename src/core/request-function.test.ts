import { it, expect, describe, beforeEach } from "bun:test";
import { RequestFN } from "./request-function";
import { AccountKind, type SessionHandle } from "~/models";

const SESSION_BASE = "https://demo.index-education.net/pronote";
const SESSION_ID = 1235678;

const handle: SessionHandle = {
  // @ts-expect-error : we only fill the necessary fields.
  information: {
    order: 0, // Will reset to 0 on each test.

    url: SESSION_BASE,
    id: SESSION_ID,

    accountKind: AccountKind.STUDENT,
    aesIV: "\tfmýÝ[½¬È»Dmøu0010",
    aesKey: "",

    // Will reset and change depending on the test.
    skipCompression: true,
    skipEncryption: true
  },
  // @ts-expect-error : we only fill the necessary fields.
  instance: {
    version: [2024, 1, 0]
  }
};

const REQUEST_NAME = "any name to fill the void.";
const REQUEST_DATA = {
  donnees: {
    number: 69,
    nullish: null,
    boolean: true,
    value: "is a string"
  }
};

beforeEach(() => {
  handle.information.order = 0;
  // @ts-expect-error : not readonly here.
  handle.information.skipCompression = true;
  // @ts-expect-error : not readonly here.
  handle.information.skipEncryption = true;
});

describe("RequestFN", () => {
  it("URLs", () => {
    let request: RequestFN;

    request = new RequestFN(handle, REQUEST_NAME, REQUEST_DATA);
    // On order === 1, the IV is empty.
    expect(request.process().url.href).toBe(SESSION_BASE + "/appelfonction/6/" + SESSION_ID + "/3fa959b13967e0ef176069e01e23c8d7");

    // Increment, fake response order.
    handle.information.order++;

    request = new RequestFN(handle, REQUEST_NAME, REQUEST_DATA);
    // Now, IV is applied, the URL is precalculated with the IV in the constant handle.
    expect(request.process().url.href).toBe(SESSION_BASE + "/appelfonction/6/" + SESSION_ID + "/7c1f9564ba825ab3d87d6dc965105db7");
  });

  it("should not encrypt and not compress", () => {
    const request = new RequestFN(handle, REQUEST_NAME, REQUEST_DATA);
    // On order === 1, the IV is empty.
    expect(request.data).toEqual(REQUEST_DATA);
  });

  it("should compress only", () => {
    // @ts-expect-error : not readonly here.
    handle.information.skipCompression = false;

    let request: RequestFN;
    request = new RequestFN(handle, REQUEST_NAME, REQUEST_DATA);
    request.process();

    expect(request.data).toBe("358ed1118030084357d220891d47dbbaff08869e1e5f798f0be80678f0e1f4245301c4a5a253c94198a158301afac7bba7297896f9c9b270d7e394dc3957d721d86759d1b4af64e36d7760e38e4d517b6cfec2e734345e");
  });

  it("should encrypt only", () => {
    // @ts-expect-error : not readonly here.
    handle.information.skipEncryption = false;

    let request: RequestFN;
    request = new RequestFN(handle, REQUEST_NAME, REQUEST_DATA);
    request.process();

    // On order === 1, the IV is empty.
    expect(request.data).toBe("4c859cd38ec673c7466130ca9b064bf7116950339c5f11b7c30b1d72191a7b29d60fc44c2a9c19751979ccb12785cd9d8178356f4d1a4a3c8e2172b90f795e1b5fff0003042ea2d790028021ce3f0666");

    // Increment, fake response order.
    handle.information.order++;

    request = new RequestFN(handle, REQUEST_NAME, REQUEST_DATA);
    request.process();

    // Now, IV is applied, the data is precalculated with the IV in the constant handle.
    expect(request.data).toBe("e098e0c0e79cdfedc9ade4c7a0a260ffae4f07eac6300ec418f337de878714a876a6750ccfe57134a8e7742ad82e2d7988f012c16035adcdaef9a2e8da57e8fef7f54e131baa656d9a7d126f90ed4213");
  });

  it("should compress and encrypt", () => {
    // @ts-expect-error : not readonly here.
    handle.information.skipCompression = false;
    // @ts-expect-error : not readonly here.
    handle.information.skipEncryption = false;

    let request: RequestFN;
    request = new RequestFN(handle, REQUEST_NAME, REQUEST_DATA);
    request.process();

    // On order === 1, the IV is empty.
    expect(request.data).toBe("ab7a186a6a76ea9e78a65a0930c001cfd112c8b36da16b0bd6817295c83d1e48396c4ec34955ae8142270519dcd631019e214af5cb135fa961ea0cefdd833afd04c25b0b3a9b6cccf6c2dbad7f5904edec3a2b095952cf8513e9a35ae6e1b7fe");

    // Increment, fake response order.
    handle.information.order++;

    request = new RequestFN(handle, REQUEST_NAME, REQUEST_DATA);
    request.process();

    // Now, IV is applied, the data is precalculated with the IV in the constant handle.
    expect(request.data).toBe("fc5edbd03c4b614c467e8da07008071c575b433aeba4d519c7885f567b68356335c998842d1ba65a687e705618f4d1bfc5f9165a46fc84f0c98a21380478bbbad607cca5fc7111388f237487bc6bea120d347e555b9a990c19f096de38bdab01");
  });
});
