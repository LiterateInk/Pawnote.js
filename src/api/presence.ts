import { RequestFN } from "~/core/request-function";
import { TabLocation, type SessionHandle } from "~/models";
import { apiProperties } from "./private/api-properties";
import { isVersionGte2024_3_9 } from "./private/versions";

export const presence = async (session: SessionHandle): Promise<void> => {
  const properties = apiProperties(session);
  let request: RequestFN;

  // Since v2024.3.9, we need to replicate the
  // old behavior of `Presence` request.
  if (isVersionGte2024_3_9(session.instance.version)) {
    request = new RequestFN(session, "Navigation", {
      [properties.signature]: { onglet: TabLocation.Presence },
      [properties.data]: {
        onglet: TabLocation.Presence,
        ongletPrec: TabLocation.Presence
      }
    });
  }
  // Before v2024.3.9, we can directly use `Presence`
  // request without any issue.
  else {
    request = new RequestFN(session, "Presence", {
      [properties.signature]: { onglet: TabLocation.Presence }
    });
  }

  await request.send();
};
