import { RequestFN } from "~/core/request-function";
import { decodeNewDiscussionRecipient } from "~/decoders/new-discussion-recipient";
import { type SessionHandle, TabLocation, type EntityKind, type NewDiscussionRecipient } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns a list of possible recipients when creating a discussion.
 *
 * This step is required before creating a discussion.
 * It allows to know who can be the recipient of the discussion.
 *
 * @param kind The kind of entity to create a discussion with. Only `Teacher`, `Student` and `Personal` are allowed.
 */
export const newDiscussionRecipients = async (session: SessionHandle, kind: EntityKind): Promise<Array<NewDiscussionRecipient>> => {
  const properties = apiProperties(session);
  const user = session.userResource;

  // TODO: use `ListePublics` for teachers.
  const request = new RequestFN(session, "ListeRessourcesPourCommunication", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      filtreElement: {
        G: user.kind,
        L: user.name,
        N: user.id
      },

      onglet: {
        N: 0,
        G: kind
      }
    }
  });

  const response = await request.send();
  return response.data[properties.data].listeRessourcesPourCommunication.V
    .filter((recipient: any) => recipient.avecDiscussion)
    .map(decodeNewDiscussionRecipient);
};
