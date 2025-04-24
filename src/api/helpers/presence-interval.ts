import { SessionHandle } from "~/models";
import { presence } from "../presence";

/**
 * @param session - The current session handle.
 * @param interval - Custom interval (in ms) for `Presence` requests.
 * Defaults to 2 minutes: same value as from Pronote.
 */
export const startPresenceInterval = (session: SessionHandle, interval: number = 2 * 60 * 1000): void => {
  clearPresenceInterval(session);
  session.presence = setInterval(() => presence(session), interval);
};

/**
 * Clears the presence interval.
 * @param session - The current session handle.
 * @returns Nothing.
 */
export const clearPresenceInterval = (session: SessionHandle): void => {
  if (session.presence) {
    clearInterval(session.presence);
    session.presence = null;
  }
};
