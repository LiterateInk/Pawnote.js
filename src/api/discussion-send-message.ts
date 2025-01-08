import { type Discussion, DiscussionActionError, DiscussionMessagesMissingError, EntityState, type SessionHandle, TabLocation } from "~/models";
import { encodeDiscussionSendAction } from "~/encoders/discussion-send-action";
import { RequestFN } from "~/core/request-function";
import { discussionMessages } from "./discussion-messages";
import { createEntityID } from "./helpers/entity-id";
import { discussions } from "./discussions";
import { apiProperties } from "./private/api-properties";

export const discussionSendMessage = async (
  session: SessionHandle,
  discussion: Discussion,
  content: string,
  includeParentsAndStudents = false,
  replyTo = discussion.messages?.defaultReplyMessageID
): Promise<void> => {
  if (!discussion.messages)
    throw new DiscussionMessagesMissingError();

  if (typeof discussion.messages.sendAction === "undefined")
    throw new DiscussionActionError();

  const properties = apiProperties(session);

  const action = encodeDiscussionSendAction(discussion.messages.sendAction, includeParentsAndStudents);
  const request = new RequestFN(session, "SaisieMessage", {
    [properties.data]: {
      contenu: session.user.authorizations.hasAdvancedDiscussionEditor ? {
        _T: 21,
        V: content
      } : content,

      bouton: { N: 0, G: action },
      brouillon: {
        N: createEntityID(),
        E: EntityState.CREATION
      },
      genreDiscussion: 0,
      messagePourReponse: {
        G: 0,
        N: replyTo
      },

      listeFichiers: []
    },

    [properties.signature]: {
      onglet: TabLocation.Discussions
    }
  });

  await request.send();

  await discussions(session, discussion.cache);
  await discussionMessages(session, discussion);
};
