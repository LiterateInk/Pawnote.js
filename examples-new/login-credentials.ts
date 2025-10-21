import { Instance, StudentLogin } from "../src-new";

const instance = Instance.fromURL(Bun.env.URL!);
const login = new StudentLogin(instance);
await login.initializeWithCredentials(Bun.env.USERNAME!, Bun.env.PASSWORD!);

if (login.requires2FA) {
  console.log("TODO: 2FA is required!");
}

// const student = await login.finalize();
// await student.timetable();
