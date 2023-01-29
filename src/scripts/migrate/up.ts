import yargs from "yargs";
import { promises as fs } from "fs";
import path from "path";
import { FileMigrationProvider, Migrator } from "kysely";

import db from "./db";

(async () => {
  await yargs.scriptName("up").argv;
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.resolve("src/server/db/migrations"),
    }),
  });
  const { error, results } = await migrator.migrateToLatest();
  results?.forEach((it) => {
    switch (it.status) {
      case "Success":
        console.log(`Migration ${it.migrationName} executed successfully`);
        break;
      case "NotExecuted":
      case "Error":
        console.log(`Failed to execute migration ${it.migrationName}`);
        break;
    }
  });
  if (error) {
    console.error(`migrateToLatest() failed: ${error}`);
    process.exit(1);
  }
  await db.destroy();
})();
