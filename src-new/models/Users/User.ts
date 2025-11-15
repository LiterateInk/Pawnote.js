import { UserParameters } from "~/models/UserParameters";
import { Authentication } from "~/models/Authentication";
import { Parameters } from "~/models/Parameters";
import { Session } from "~/models/Session";

/**
 * An abstract PRONOTE authenticated user.
 * Contains properties that is used globally for every webspaces.
 */
export abstract class User {
  /**
   * Only the library can instantiate this class.
   * @internal
   */
  protected constructor(
    protected readonly user: UserParameters,

    /**
     * Everything to call APIs and communicate with PRONOTE.
     * Should not be used outside the library.
     *
     * @internal
     */
    public readonly session: Session,

    /**
     * Parameters given to the user at the beginning of the session.
     * In this, you'll be able to find multiple properties used
     * to know how the instance is configured.
     */
    public readonly parameters: Parameters,

    /**
     * Properties used and given during authentication that could be
     * helpful for next authentications.
     *
     * @internal
     */
    private readonly authentication: Authentication
  ) {}

  public get username(): string {
    return this.authentication.username;
  }

  public get token(): string {
    return this.authentication.token;
  }

  public get uuid(): string {
    return this.authentication.uuid;
  }

  public get id(): string {
    return this.user.resource.n;
  }

  public get name(): string {
    return this.user.resource.l;
  }

  public get kind(): number {
    return this.user.resource.g;
  }

  /**
   * A quick alias for {@link Parameters.navigatorIdentifier | `this.parameters.navigatorIdentifier`}.
   */
  public get navigatorIdentifier(): string | null {
    return this.parameters.navigatorIdentifier;
  }
}
