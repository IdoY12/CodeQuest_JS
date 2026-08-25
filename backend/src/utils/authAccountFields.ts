/**
 * Derived account-type facts included in every auth/user payload.
 *
 * Responsibility: tell the client whether the account has a password and which
 * social provider it uses, without leaking the hash or the provider IDs.
 * Layer: backend utils
 * Consumers: auth controllers, issueSessionForUser, user profile handler
 */

type AuthAccountSource = {
  hashedPassword: string | null;
  googleId: string | null;
  appleSub: string | null;
};

export function authAccountFields(user: AuthAccountSource): {
  hasPassword: boolean;
  authProvider: "google" | "apple" | null;
} {
  return {
    hasPassword: user.hashedPassword !== null,
    authProvider: user.googleId ? "google" : user.appleSub ? "apple" : null,
  };
}
