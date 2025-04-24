import { RequestFN } from "~/core/request-function";
import { decodeDiscussion } from "~/decoders/discussion";
import { decodeDiscussionFolder } from "~/decoders/discussion-folder";
import { type Discussion, type Discussions, TabLocation, type SessionHandle } from "~/models";
import type { _DiscussionsCache } from "./private/discussions-cache";
import { apiProperties } from "./private/api-properties";

/**
 * Retrieve discussions from the server.
 * @param session - The current session handle.
 * @param cache - The cache to store discussions.
 * @returns A promise that resolves to the discussions.
 */
export const discussions = async (session: SessionHandle, cache: _DiscussionsCache = {_:[]}): Promise<Discussions> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "ListeMessagerie", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      avecLu: true,
      avecMessage: true,
      possessionMessageDiscussionUnique: null
    }
  });

  const response = await request.send();
  const data = response.data[properties.data];

  const folders = data.listeEtiquettes.V.map(decodeDiscussionFolder);

  const items: Discussion[] = data.listeMessagerie.V
    .filter((discussion: any) => {
      const hasZeroDepth = (discussion.profondeur || 0) === 0;
      const hasParticipants = discussion.messagePourParticipants?.V.N;
      return discussion.estUneDiscussion && hasParticipants && hasZeroDepth;
    })
    .map((discussion: any) => decodeDiscussion(discussion, folders, cache));

  // This is a trick to keep the reference to the items
  // in the cache, while updating the items.
  cache._.length = 0;
  cache._.push(...items);

  for (const item of cache._) {
    if (item.participantsMessageID in cache) {
      // Mutate the reference directly in cache.
      Object.assign(cache[item.participantsMessageID], item);
    }
    else {
      // Create the reference in cache.
      cache[item.participantsMessageID] = item;
    }
  }

  // Delete outdated keys, in case there are any.
  for (const key in cache) {
    if (key === "_") continue;
    if (!cache._.find((item) => item.participantsMessageID === key)) {
      delete cache[key];
    }
  }

  return {
    folders,
    // Instead of returning the items, we return
    // the reference to the items in the cache.
    items: cache._
  };
};
