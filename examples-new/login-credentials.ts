import { Instance, Login, Webspace } from "../src-new";

const instance = Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
const login = new Login(instance);
// await login.initializeWithCrendentials(Webspace.Students, "demonstration", "pronotevs");
// console.log(login.requiresMFA);
// const student = login.finalize().toStudent();
