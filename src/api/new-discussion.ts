import { RequestFN } from "~/core/request-function";
import { EntityState, NewDiscussionRecipient, SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Create a discussion.
 *
 * Sadly, we can't get the ID of the created discussion
 * or anything else related to it, you need to request the
 * discussions list once again.
*/
export const newDiscussion = async (
  session: SessionHandle,
  subject: string,
  content: string,
  recipients: Array<NewDiscussionRecipient>
): Promise<void> => {
  const properties = apiProperties(session);
  const request = new RequestFN(session, "SaisieMessage", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      contenu: session.user.authorizations.hasAdvancedDiscussionEditor ? {
        _T: 21,
        V: content
      } : content,

      objet: subject,
      estCreationCarnetLiaison: false,
      listeFichiers: [],
      listeDestinataires: recipients.map((recipient) => ({
        E: EntityState.MODIFICATION,
        G: recipient.kind,
        N: recipient.id
      }))
    }
  });

  await request.send();
};
