import type { AccountKind } from "./account-kind";

/**
 * Base interface for authentication parameters
 */
export interface BaseAuthenticationParams {
  /** URL of the PRONOTE instance */
  url: string;
  /** Account type (student, parent, etc.) */
  kind: AccountKind;
  /** Username for authentication */
  username: string;
  /** Device UUID for identification */
  deviceUUID: string;
  /** Navigator identifier (optional) */
  navigatorIdentifier?: string;
}

/**
 * Parameters for password-based authentication
 */
export interface PasswordAuthenticationParams extends BaseAuthenticationParams {
  /** Password for authentication */
  password: string;
  /** Token should not be present */
  token?: never;
}

/**
 * Parameters for token-based authentication
 */
export interface TokenAuthenticationParams extends BaseAuthenticationParams {
  /** Token for authentication */
  token: string;
  /** Password should not be present */
  password?: never;
}

/**
 * Combined type for all authentication methods
 */
export type AuthenticationParams = PasswordAuthenticationParams | TokenAuthenticationParams;
