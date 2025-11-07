import { Instance, StudentLoginPortal } from "../../src-new";

const instance = Instance.fromURL(Bun.env.URL!);
const portal = new StudentLoginPortal(instance);

const auth = await portal.credentials(Bun.env.USERNAME!, Bun.env.PASSWORD!, Bun.env.UUID!);
// const auth = await portal.token(Bun.env.USERNAME!, Bun.env.TOKEN!, Bun.env.UUID!);

console.info(`[*] authenticating to ${instance.base}...`);

const student = await portal.finish(auth);

console.info("[*] congratulations, you're authenticated!");
console.info("[*] token:", student.token);

// -----------------------------------------------------------------------------

const timetable = await student.administration.getTimetableFromWeek(3);
