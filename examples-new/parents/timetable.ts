import { Instance, ParentLoginPortal } from "pawnote";

const instance = Instance.fromURL(Bun.env.URL!);
const portal = new ParentLoginPortal(instance);

const auth = await portal.credentials(Bun.env.USERNAME!, Bun.env.PASSWORD!, Bun.env.UUID!);
// const auth = await portal.token(Bun.env.USERNAME!, Bun.env.TOKEN!, Bun.env.UUID!);

console.info(`[*] authenticating to ${instance.base}...`);

const parent = await portal.finish(auth);

console.info("[*] congratulations, you're authenticated!");
console.info("[*] token:", parent.token);

// -----------------------------------------------------------------------------

const child = parent.children[0];
const timetable = await child.administration.getTimetableFromWeek(3);
