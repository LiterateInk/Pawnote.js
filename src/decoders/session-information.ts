import { SessionAccessKind, type SessionInformation } from "~/models";
import forge from "node-forge";
import { isVersionGte2025_1_3 } from "~/api/private/versions";

const RSA_MODULO_1024 = "B99B77A3D72D3A29B4271FC7B7300E2F791EB8948174BE7B8024667E915446D4EEA0C2424B8D1EBF7E2DDFF94691C6E994E839225C627D140A8F1146D1B0B5F18A09BBD3D8F421CA1E3E4796B301EEBCCF80D81A32A1580121B8294433C38377083C5517D5921E8A078CDC019B15775292EFDA2C30251B1CCABE812386C893E5";
const RSA_EXPONENT_1024 = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001";

export const decodeSessionInformation = (session: any, base: string, version: number[]): SessionInformation => {
  const rsaFromConstants = !session.MR && !session.ER;

  let skipEncryption: boolean;
  let skipCompression: boolean;

  if (isVersionGte2025_1_3(version)) {
    skipEncryption = session.CrA ? false : true;
    skipCompression = session.CoA ? false : true;
  }
  else {
    skipEncryption = session.sCrA ?? false;
    skipCompression = session.sCoA ?? false;
  }

  return {
    url: base,

    id: parseInt(session.h),
    accountKind: session.a,
    demo: session.d ?? false,
    accessKind: session.g ?? SessionAccessKind.ACCOUNT,

    rsaModulus: rsaFromConstants ? RSA_MODULO_1024 : session.MR,
    rsaExponent: rsaFromConstants ? RSA_EXPONENT_1024 : session.ER,
    rsaFromConstants,

    aesIV: forge.random.getBytesSync(16),
    aesKey: "",

    skipEncryption,
    skipCompression,
    http: session.http ?? false,
    /**
     * @deprecated removed on 2025.1.3
     */
    poll: session.poll ?? false,
    order: 0
  };
};
