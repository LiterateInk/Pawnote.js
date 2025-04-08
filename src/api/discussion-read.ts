import { Discussion, SessionHandle } from "~/models";
import { discussionMessages } from "./discussion-messages";

/**
 * Mark a discussion as read.
 * @remark Shortcut of `discussionMessages` but here we don't return anything.
 * @param {SessionHandle} session - The current session handle.
 * @param {Discussion} discussion - The discussion to mark as read.
 * @returns {Promise<void>} - Nothing.
 */
export const discussionRead = async (session: SessionHandle, discussion: Discussion): Promise<void> => {
  await discussionMessages(session, discussion, true);
};
