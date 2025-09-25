import { Instance } from "../src-new";

const instance = Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
console.log(instance.base);

const info = await instance.getInformation();
console.log(info);
