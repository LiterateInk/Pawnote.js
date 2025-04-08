import { RequestFN } from "~/core/request-function";
import { decodeDiscussionMessages } from "~/decoders/discussion-messages";
import { type Discussion, DiscussionMessages, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Fetches the messages and writes them in the discussion.
 * By default it won't mark the messages as read even after fetching them.
 *
 * You can change this behavior by setting `markAsRead` to `true`.
 * There's no other way to mark the messages as read.
 *
 * @param {SessionHandle} session - The current session handle.
 * @param {Discussion} discussion - The discussion object to fetch messages for.
 * @param {boolean} [markAsRead=false] Whether to mark the messages as read after fetching them.
 */
export const discussionMessages = async (session: SessionHandle, discussion: Discussion, markAsRead: boolean = false): Promise<DiscussionMessages> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "ListeMessages", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      listePossessionsMessages: discussion.possessions,
      marquerCommeLu: markAsRead,
      nbMessagesVus: 0 // fetch all messages
    }
  });

  const response = await request.send();
  const messages = decodeDiscussionMessages(response.data[properties.data], session);

  if (!discussion.messages) // setup the reference
    discussion.messages = messages;
  else // mutate the reference
    Object.assign(discussion.messages, messages);

  return messages;
};
