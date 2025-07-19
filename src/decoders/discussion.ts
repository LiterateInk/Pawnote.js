import type { _DiscussionsCache } from "~/api/private/discussions-cache";
import type { Discussion, DiscussionFolder } from "~/models";

export const decodeDiscussion = (discussion: any, folders: DiscussionFolder[], cache: _DiscussionsCache): Discussion => {
  return {
    cache,
    creator: discussion.initiateur,
    date: convertLabelToDate(discussion.libelleDate),
    recipientName: discussion.public,
    participantsMessageID: discussion.messagePourParticipants.V.N,
    possessions: discussion.listePossessionsMessages.V,
    numberOfDrafts: discussion.nbBrouillons ?? 0,
    subject: discussion.objet ?? "",
    numberOfMessages: discussion.nombreMessages ?? 0,
    numberOfMessagesUnread: discussion.nbNonLus ?? 0,
    closed: discussion.ferme ?? false,
    folders: discussion.listeEtiquettes?.V
      .map((current: any) =>
        folders.find((decoded) => decoded.id === current.N)
      )
      .filter(Boolean) ?? []
  };
};

function convertLabelToDate(
  label: string
): Date {
  const now = new Date();
  const weekdays = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi"
  ];

  const weekdayTimeMatch = label.match(
    /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)?\s*(\d{1,2})h(\d{2})/i
  );
  if (weekdayTimeMatch) {
    const [, weekdayStr, h, m] = weekdayTimeMatch;
    const hours = parseInt(h);
    const minutes = parseInt(m);
    const target = new Date(now);

    if (weekdayStr) {
      const targetWeekday = weekdays.indexOf(weekdayStr.toLowerCase());
      const currentWeekday = now.getDay();

      let delta = targetWeekday - currentWeekday;

      target.setDate(now.getDate() + delta);
    }

    target.setHours(hours, minutes, 0, 0);
    return target;
  }

  const fullDateMatch = label.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (fullDateMatch) {
    let [_, day, month, year] = fullDateMatch;
    let y = parseInt(year);
    if (y < 100) y += 2000;
    return new Date(y, parseInt(month) - 1, parseInt(day));
  }

  const shortDateMatch = label.match(/(\d{1,2})\/(\d{1,2})/);
  if (shortDateMatch) {
    let [_, day, month] = shortDateMatch;
    const parsed = new Date(
      now.getFullYear(),
      parseInt(month) - 1,
      parseInt(day)
    );

    if (
      parsed > now &&
        parsed.getTime() - now.getTime() > 3 * 24 * 60 * 60 * 1000
    ) {
      parsed.setFullYear(parsed.getFullYear() - 1);
    }

    return parsed;
  }

  throw new Error("Couldn't convert this label to a date, please open an issue with the label to improve this function.");
}
