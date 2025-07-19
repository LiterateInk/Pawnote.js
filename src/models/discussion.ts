import type { _DiscussionsCache } from "~/api/private/discussions-cache";
import type { DiscussionFolder } from "./discussion-folder";
import type { DiscussionMessages } from "./discussion-messages";

export type Discussion = Readonly<{
  creator?: string
  recipientName?: string

  date: Date

  /**
   * Internal string containing the ID of the message
   * needed to fetch the participants of the discussion.
   */
  participantsMessageID: string

  /**
   * Property used internally to manage messages in
   * this discussion in requests.
   *
   * You can ignore this property.
   */
  possessions: any

  /**
   * Title of the discussion.
   */
  subject: string

  numberOfDrafts: number
  numberOfMessages: number
  numberOfMessagesUnread: number
  folders: DiscussionFolder[]
  closed: boolean

  /**
   * Internal use only,
   * please never use this manually as it
   * could break internal references.
   */
  cache: _DiscussionsCache
}> & {
  /**
   * Only available after requesting them.
   * The handle will automatically add them here.
   */
  messages?: DiscussionMessages
};
