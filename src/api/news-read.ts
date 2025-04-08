import type { NewsInformation, NewsSurvey, SessionHandle } from "~/models";
import { newsRemoteMutate } from "./private/news-remote-mutate";

/**
 * Patches the `read` state of the news to the given value.
 * @remark Will do nothing if `read === status`.
 * @param {SessionHandle} session - The current session handle.
 * @param {NewsInformation | NewsSurvey} item - The news item to patch.
 * @param {boolean} read - The new read state.
 * @returns {Promise<void>} - Nothing.
 */
export const newsRead = async (session: SessionHandle, item: NewsInformation | NewsSurvey, read: boolean) => {
  // Do nothing if the status is already the same.
  if (item.read === read) {
    return;
  }

  // Update the server state.
  await newsRemoteMutate(session, item, {
    onlyMarkAsRead: true,
    markAsRead: read,
    delete: false
  });

  // Update the local state.
  item.read = read;
};
