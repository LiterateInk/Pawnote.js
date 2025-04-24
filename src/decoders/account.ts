import type { Account, SessionHandle } from "~/models";

/**
 * Get more information on the user
 * such email, phone, address and INE if the user is a student.
 * @param account - The account object containing user information.
 * @param session - The current session handle.
 * @returns The decoded account information.
 */
export const decodeAccount = (account: any, session: SessionHandle): Account => {
  const information = account.Informations;
  let iCalToken: string | undefined;

  if (session.instance.version[0] >= 2024) {
    iCalToken = account.iCal?.liste.V[0]?.paramICal;
  }

  return {
    address: [
      information.adresse1,
      information.adresse2,
      information.adresse3,
      information.adresse4
    ],

    postalCode: information.codePostal,
    province: information.province,
    country: information.pays,
    city: information.ville,

    email: information.eMail,
    phone: `+${information.indicatifTel}${information.telephonePortable}`,

    INE: information.numeroINE,
    iCalToken
  };
};
