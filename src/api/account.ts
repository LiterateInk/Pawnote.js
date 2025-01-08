import { RequestFN } from "~/core/request-function";
import { decodeAccount } from "~/decoders/account";
import { type Account, type SessionHandle, TabLocation } from "~/models";
import { dataProperty } from "./private/data-property";

export const account = async (session: SessionHandle): Promise<Account> => {
  const request = new RequestFN(session, "PageInfosPerso", {
    _Signature_: {
      onglet: TabLocation.Account
      // TODO: Check if this is required in older version. On 2024, we apparently don't need it anymore.
      // ressource: {
      //   G: 4,
      //   N: input.userID
      // }
    }
  });

  const response = await request.send();
  return decodeAccount(response.data[dataProperty(session)], session);
};
