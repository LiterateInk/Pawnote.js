import * as pronote from "../src";
import { credentials } from "./_credentials";

void async function main () {
  const session = pronote.createSessionHandle();
  await pronote.loginCredentials(session, {
    url: credentials.pronoteURL,
    kind: pronote.AccountKind.STUDENT,
    username: credentials.username,
    password: credentials.password,
    deviceUUID: credentials.deviceUUID
  });

  // You can maually make presence requests.
  await pronote.presence(session);

  // Start presence requests every 2 minutes.
  pronote.startPresenceInterval(session);
  // `setInterval` return value will be stored under `session.presence`.

  // Stop presence after 5 minutes.
  setTimeout(() => pronote.clearPresenceInterval(session), 5 * 60 * 1000);
}();
