import { Instance, ParentLoginPortal } from "pawnote";

const instance = Instance.fromURL(Bun.env.URL!);
const portal = new ParentLoginPortal(instance);
const auth = await portal.token(Bun.env.USERNAME!, Bun.env.TOKEN!, Bun.env.UUID!);

console.info(`[*] authenticating to ${instance.base}...`);

const parent = await portal.finish(auth);

console.info("[*] congratulations, you're re-authenticated!");
console.info("[*] new token:", parent.token);

// -----------------------------------------------------------------------------

for (const child of parent.children) {
  console.log("[+]", child.name, `(${child.id})`);
}
