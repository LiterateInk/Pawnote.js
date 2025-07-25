import { type Discussion, DiscussionActionError, type DiscussionDraftMessage, type SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";
import { encodeDiscussionSendAction } from "~/encoders/discussion-send-action";
import { discussions } from "./discussions";
import { discussionMessages } from "./discussion-messages";

export const discussionSendDraft = async (session: SessionHandle, discussion: Discussion, draft: DiscussionDraftMessage, includeParentsAndStudents = false): Promise<void> => {
  if (typeof discussion.messages?.sendAction === "undefined")
    throw new DiscussionActionError();

  await discussionPostCommand(session, "", {
    button: encodeDiscussionSendAction(discussion.messages.sendAction, includeParentsAndStudents),
    content: draft.content,
    id: draft.possessionID,
    replyMessageID: draft.replyMessageID
  });

  await discussions(session, discussion.cache);
  await discussionMessages(session, discussion);
};
