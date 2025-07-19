import { it, expect, describe, beforeEach } from "bun:test";
import { AccountKind, type SessionHandle } from "~/models";
import { ResponseFN } from "./response-function";

import forge from "node-forge";
import { AES } from "../api/private/aes";
import pako from "pako";

const SESSION_BASE = "https://demo.index-education.net/pronote";
const SESSION_ID = 1235678;

const handle: SessionHandle = {
  // @ts-expect-error : we only fill the necessary fields.
  information: {
    order: 2, // Will reset to 2 on each test.

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

const RAW_DATA = {
  donnees: {
    number: 69,
    nullish: null,
    boolean: true,
    value: "is a string"
  }
};

const ENCRYPTED_DATA = "e098e0c0e79cdfedc9ade4c7a0a260ffae4f07eac6300ec418f337de878714a876a6750ccfe57134a8e7742ad82e2d7988f012c16035adcdaef9a2e8da57e8fef7f54e131baa656d9a7d126f90ed4213";
let COMPRESSED_DATA: string;
{ // Contrary to RequestFN, the data is not HEX-ed first when compressed.
  const deflated = pako.deflateRaw(JSON.stringify(RAW_DATA), { level: 6 });
  const bytes = Array.from(deflated).map((byte) => String.fromCharCode(byte)).join("");
  COMPRESSED_DATA = forge.util.bytesToHex(bytes);
}

let ENCRYPTED_AND_COMPRESSED_DATA: string;
{ // Contrary to RequestFN, the data is not HEX-ed first when compressed.
  const deflated = pako.deflateRaw(JSON.stringify(RAW_DATA), { level: 6 });
  const bytes = Array.from(deflated).map((byte) => String.fromCharCode(byte)).join("");
  ENCRYPTED_AND_COMPRESSED_DATA = AES.encrypt(bytes, forge.util.createBuffer(handle.information.aesKey), forge.util.createBuffer(handle.information.aesIV));
}

const mock = (data: any) => JSON.stringify({ donneesSec: data });

beforeEach(() => {
  handle.information.order = 2;
  // @ts-expect-error : not readonly here.
  handle.information.skipCompression = true;
  // @ts-expect-error : not readonly here.
  handle.information.skipEncryption = true;
});

describe("ResponseFN", () => {
  it("should not decrypt and not decompress", () => {
    const response = new ResponseFN(handle, mock(RAW_DATA));
    expect(response.data).toEqual(RAW_DATA);
  });

  it("should only decrypt", () => {
    // @ts-expect-error : not readonly here.
    handle.information.skipEncryption = false;

    const response = new ResponseFN(handle, mock(ENCRYPTED_DATA));
    expect(response.data).toEqual(RAW_DATA);
  });

  it("should only decompress", () => {
    // @ts-expect-error : not readonly here.
    handle.information.skipCompression = false;

    const response = new ResponseFN(handle, mock(COMPRESSED_DATA));
    expect(response.data).toEqual(RAW_DATA);
  });

  it("should decrypt and decompress", () => {
    // @ts-expect-error : not readonly here.
    handle.information.skipCompression = false;
    // @ts-expect-error : not readonly here.
    handle.information.skipEncryption = false;

    const response = new ResponseFN(handle, mock(ENCRYPTED_AND_COMPRESSED_DATA));
    expect(response.data).toEqual(RAW_DATA);
  });
});
