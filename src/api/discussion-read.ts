import { Discussion, SessionHandle } from "~/models";
import { discussionMessages } from "./discussion-messages";

/**
 * Mark a discussion as read.
 * @remark Shortcut of `discussionMessages` but here we don't return anything.
 * @param session - The current session handle.
 * @param discussion - The discussion to mark as read.
 * @returns Nothing.
 */
export const discussionRead = async (session: SessionHandle, discussion: Discussion): Promise<void> => {
  await discussionMessages(session, discussion, true);
};
