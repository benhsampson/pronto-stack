import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("emailVerified", "timestamptz")
    .addColumn("image", "text")
    .execute();
  await db.schema
    .createTable("accounts")
    .addColumn("userId", "text", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "integer")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .addPrimaryKeyConstraint("pk_accounts", ["provider", "providerAccountId"])
    .execute();
  await db.schema
    .createTable("sessions")
    .addColumn("sessionToken", "text", (col) => col.notNull().unique())
    .addColumn("userId", "text", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute();
  await db.schema
    .createTable("verification_tokens")
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .addPrimaryKeyConstraint("pk_verification_tokens", ["identifier", "token"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("verification_tokens").execute();
  await db.schema.dropTable("sessions").execute();
  await db.schema.dropTable("accounts").execute();
  await db.schema.dropTable("users").execute();
}
