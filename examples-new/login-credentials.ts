import { Instance, StudentLogin, Webspace } from "../src-new";

const instance = Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
const login = new StudentLogin(instance);
await login.initializeWithCredentials("demonstration", "pronotevs");
// console.log(login.requiresMFA);
// const student = login.finalize().toStudent();
