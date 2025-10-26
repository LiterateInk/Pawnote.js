import { Instance, StudentLoginPortal } from "../src-new";

const instance = Instance.fromURL(Bun.env.URL!);
const portal = new StudentLoginPortal(instance);
const auth = await portal.credentials(Bun.env.USERNAME!, Bun.env.PASSWORD!);

console.log(`authenticating to ${instance.base}...`);

// On the first ever login, you might be asked to custom your password.
// Also, administrators can reset your password and you will also be
// asked to custom your password on the next login.
if (auth.shouldCustomPassword) {
  console.log("you have to custom the password, make sure to respect the following rules.");
  console.log("\t- max:", auth.password.max);
  console.log("\t- min:", auth.password.min);

  if (auth.password.withAtLeastOneLetter)
    console.log("\t- with at least one letter");

  if (auth.password.withAtLeastOneNumericCharacter)
    console.log("\t- with at least one numeric character");

  if (auth.password.withAtLeastOneSpecialCharacter)
    console.log("\t- with at least one special character");

  if (auth.password.withLowerAndUpperCaseMixed)
    console.log("\t- with lower and upper case mixed");

  while (true) {
    const password = prompt("new password>");

    if (!password) continue;
    if (await auth.validate(password)) break;
    else console.warn("[!] this password is not strong enough, please respect all the rules");
  }
}

if (auth.shouldCustomDoubleAuth) {
  console.log("CUSTOM MFA");
  // if (auth.modes.includes(DoubleAuthMode.PIN)) {
  //   auth.mode.pin("1234");
  // }
  // else {
  //   auth.mode.nothing();
  // }
}

if (auth.shouldEnterPIN) {
  while (true) {
    const pin = prompt("pin>");

    if (!pin) continue;
    if (await auth.verify(pin)) break;
    else console.warn("[!] incorrect pin, try again");
  }
}

if (auth.shouldRegisterSource) {
  while (true) {
    const device = prompt("device>", `Pawnote.js/${Date.now()}`);

    if (!device) continue;
    if (device.length > 30) {
      console.warn("[!] device name should be <=30 characters length");
      continue;
    }

    const alreadyKnown = await auth.source(device);
    if (alreadyKnown) console.info("[*] this device is already known, registration will be skipped");
    break;
  }
}

const student = await portal.finish(auth);
// await student.timetable();
// console.log(student);
