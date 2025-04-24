import type { SessionHandle, UserResource } from "~/models";

function use (session: SessionHandle, index: number): void;
function use (session: SessionHandle, resource: UserResource): void;
/**
  * Set the user resource to be used.
  * @param session - The current session handle.
  * @param value - The resource index or the resource to set.
 */
function use (session: SessionHandle, value: any): void {
  session.userResource = typeof value === "number" ? session.user.resources[value] : value;
}

export { use };
