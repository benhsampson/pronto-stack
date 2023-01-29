import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import { Adapter, AdapterAccount } from "next-auth/adapters";
import { ProviderType } from "next-auth/providers";

export function PGAdapter(db: Kysely<DB>): Adapter {
  return {
    createUser: async (data) => {
      const user = await db
        .insertInto("users")
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return user;
    },
    getUser: async (id) => {
      const user = await db
        .selectFrom("users")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
      return user || null;
    },
    getUserByEmail: async (email) => {
      const user = await db
        .selectFrom("users")
        .selectAll()
        .where("email", "=", email)
        .executeTakeFirst();
      return user || null;
    },
    getUserByAccount: async ({ providerAccountId }) => {
      const user = await db
        .selectFrom("accounts")
        .where("providerAccountId", "=", providerAccountId)
        .innerJoin("users as u", "u.id", "accounts.userId")
        .select(["u.id", "u.email", "u.emailVerified", "u.image", "u.name"])
        .executeTakeFirst();
      return user || null;
    },
    updateUser: async ({ id, ...data }) => {
      if (!id) throw Error("Cannot update without ID");
      const user = await db
        .updateTable("users")
        .set(data)
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();
      return user;
    },
    deleteUser: async (userId) => {
      // TODO: Soft delete
      const user = await db
        .deleteFrom("users")
        .where("id", "=", userId)
        .returningAll()
        .executeTakeFirst();
      return user;
    },
    linkAccount: async (data) => {
      const {
        access_token,
        token_type,
        id_token,
        refresh_token,
        scope,
        expires_at,
        session_state,
        type,
        ...account
      } = await db
        .insertInto("accounts")
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      if (
        !access_token ||
        !token_type ||
        !refresh_token ||
        !scope ||
        !expires_at
        // id_token and session_state are undefined when signing up (not just signing in)
        // this is not dissimilar to what happens in the Prisma adapter https://github.com/nextauthjs/next-auth/tree/main/packages/adapter-prisma
        // !id_token ||
        // !session_state
      ) {
        console.error(data);
        throw new Error("Cannot link account without token fields defined");
      }
      return {
        access_token,
        token_type,
        id_token,
        refresh_token,
        scope,
        expires_at,
        session_state,
        type: type as ProviderType,
        ...account,
      } as AdapterAccount;
    },
    unlinkAccount: async ({ providerAccountId }) => {
      const {
        access_token,
        token_type,
        id_token,
        refresh_token,
        scope,
        expires_at,
        session_state,
        type,
        ...account
      } = await db
        .deleteFrom("accounts")
        .where("providerAccountId", "=", providerAccountId)
        .returningAll()
        .executeTakeFirstOrThrow();
      if (
        !access_token ||
        !token_type ||
        !refresh_token ||
        !scope ||
        !expires_at
        // !id_token ||
        // !session_state
      ) {
        throw new Error("Cannot unlink account without token fields defined");
      }
      return {
        ...account,
        access_token,
        token_type,
        id_token,
        refresh_token,
        scope,
        expires_at,
        session_state,
        type: type as ProviderType,
        ...account,
      } as AdapterAccount;
    },
    createSession: async (data) => {
      const session = await db
        .insertInto("sessions")
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return session;
    },
    getSessionAndUser: async (sessionToken) => {
      const userAndSession = await db
        .selectFrom("sessions")
        .where("sessionToken", "=", sessionToken)
        .innerJoin("users as u", "u.id", "sessions.userId")
        .selectAll()
        .executeTakeFirst();
      return userAndSession
        ? {
            session: userAndSession,
            user: userAndSession,
          }
        : null;
    },
    updateSession: async (data) => {
      const session = await db
        .updateTable("sessions")
        .set(data)
        .where("sessionToken", "=", data.sessionToken)
        .returningAll()
        .executeTakeFirst();
      return session;
    },
    deleteSession: async (sessionToken) => {
      const session = await db
        .deleteFrom("sessions")
        .where("sessionToken", "=", sessionToken)
        .returningAll()
        .executeTakeFirst();
      return session;
    },
    createVerificationToken: async (data) => {
      const verificationToken = await db
        .insertInto("verification_tokens")
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return verificationToken;
    },
    useVerificationToken: async ({ identifier, token }) => {
      const verificationToken = await db
        .deleteFrom("verification_tokens")
        .where("identifier", "=", identifier)
        .where("token", "=", token)
        .returningAll()
        .executeTakeFirst();
      return verificationToken || null;
    },
  };
}
