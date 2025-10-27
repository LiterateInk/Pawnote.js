import { Instance, ParentLoginPortal } from "../../src-new";

const instance = Instance.fromURL(Bun.env.URL!);
const portal = new ParentLoginPortal(instance);
const auth = await portal.credentials(Bun.env.USERNAME!, Bun.env.PASSWORD!);

console.info(`[*] authenticating to ${instance.base}...`);

// On the first ever login, you might be asked to custom your password.
// Also, administrators can reset your password and you will also be
// asked to custom your password on the next login.
if (auth.shouldCustomPassword) {
  console.info("[*] you have to custom the password, make sure to respect the following rules.");
  console.info("\t- max:", auth.password.max);
  console.info("\t- min:", auth.password.min);

  if (auth.password.withAtLeastOneLetter)
    console.info("\t- with at least one letter");

  if (auth.password.withAtLeastOneNumericCharacter)
    console.info("\t- with at least one numeric character");

  if (auth.password.withAtLeastOneSpecialCharacter)
    console.info("\t- with at least one special character");

  if (auth.password.withLowerAndUpperCaseMixed)
    console.info("\t- with lower and upper case mixed");

  while (true) {
    const password = prompt("new password>");

    if (!password) continue;
    if (await auth.validate(password)) break;
    else console.warn("[!] this password is not strong enough, please respect all the rules");
  }
}

if (auth.shouldCustomDoubleAuthMode) {
  if (auth.hasIgnoreMode) {
    auth.useIgnoreMode();
  }
  else if (auth.hasNotificationMode) {
    auth.useNotificationMode();
  }
  else if (auth.hasPinMode) {
    while (true) {
      const pin = prompt("new pin>");
      if (!pin) continue;

      auth.usePinMode(pin);
      break;
    }
  }
}

if (auth.shouldEnterPin) {
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

const parent = await portal.finish(auth);

console.info("[*] congratulations, you're authenticated!");
console.info("[*] username:", parent.username);
console.info("[*] token:", parent.token);
