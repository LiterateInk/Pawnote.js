import { RequestFN } from "~/core/request-function";
import { decodeDiscussionMessages } from "~/decoders/discussion-messages";
import { type Discussion, DiscussionMessages, type SessionHandle, TabLocation } from "~/models";
import { dataProperty } from "./private/data-property";

/**
 * Fetches the messages and writes them in the discussion.
 * By default it won't mark the messages as read even after fetching them.
 *
 * You can change this behavior by setting `markAsRead` to `true`.
 * There's no other way to mark the messages as read.
 *
 * @param markAsRead Whether to mark the messages as read after fetching them.
 */
export const discussionMessages = async (session: SessionHandle, discussion: Discussion, markAsRead = false): Promise<DiscussionMessages> => {
  const property = dataProperty(session);

  const request = new RequestFN(session, "ListeMessages", {
    _Signature_: { onglet: TabLocation.Discussions },

    [property]: {
      listePossessionsMessages: discussion.possessions,
      marquerCommeLu: markAsRead,
      nbMessagesVus: 0 // fetch all messages
    }
  });

  const response = await request.send();
  const messages = decodeDiscussionMessages(response.data[property], session);

  if (!discussion.messages) // setup the reference
    discussion.messages = messages;
  else // mutate the reference
    Object.assign(discussion.messages, messages);

  return messages;
};
