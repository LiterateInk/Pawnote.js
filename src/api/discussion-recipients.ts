import { RequestFN } from "~/core/request-function";
import { decodeDiscussionRecipient } from "~/decoders/discussion-recipient";
import { Discussion, DiscussionRecipient, SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Fetches the recipients of the discussion.
 *
 * A recipient is someone who is part of the discussion.
 * They don't have to send a message to be considered as a recipient.
 */
export const discussionRecipients = async (session: SessionHandle, discussion: Discussion): Promise<Array<DiscussionRecipient>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisiePublicMessage", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      message: { N: discussion.participantsMessageID },
      estPublicParticipant: true,
      estDestinatairesReponse: false
    }
  });

  const response = await request.send();
  return response.data[properties.data].listeDest.V.map(decodeDiscussionRecipient);
};
