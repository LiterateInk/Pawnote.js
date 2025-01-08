import { RequestFN } from "~/core/request-function";
import { TabLocation, type SessionHandle } from "~/models";
import { apiProperties } from "./private/api-properties";

export const presence = async (session: SessionHandle): Promise<void> => {
  const request = new RequestFN(session, "Presence", {
    [apiProperties(session).signature]: { onglet: TabLocation.Presence }
  });

  await request.send();
};
