import pg from "pg";
import dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";

dotenv.config();

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

export default db;
