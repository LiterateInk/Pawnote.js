import { RequestFN } from "~/core/request-function";
import { decodeDiscussionRecipient } from "~/decoders/discussion-recipient";
import { Discussion, DiscussionRecipient, SessionHandle, TabLocation } from "~/models";
import { dataProperty } from "./private/data-property";

/**
 * Fetches the recipients of the discussion.
 *
 * A recipient is someone who is part of the discussion.
 * They don't have to send a message to be considered as a recipient.
 */
export const discussionRecipients = async (session: SessionHandle, discussion: Discussion): Promise<Array<DiscussionRecipient>> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "SaisiePublicMessage", {
    _Signature_: { onglet: TabLocation.Discussions },

    [property]: {
      message: { N: discussion.participantsMessageID },
      estPublicParticipant: true,
      estDestinatairesReponse: false
    }
  });

  const response = await request.send();
  return response.data[property].listeDest.V.map(decodeDiscussionRecipient);
};
