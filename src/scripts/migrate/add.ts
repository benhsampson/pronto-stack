import yargs from "yargs";
import { z } from "zod";
import fs from "fs";
import path from "path";

(async () => {
  const { _: args } = await yargs
    .scriptName("add")
    .usage("$0 [args]")
    .demandCommand(1).argv;

  const _name = args[0];
  const name = z.string().parse(_name).toLowerCase().replace(/\s/g, "-");

  if (name) {
    fs.copyFileSync(
      `${__dirname}/base.ts`,
      path.resolve(
        `src/server/db/migrations/${new Date().getTime()}-${name}.ts`,
      ),
    );
  }
})();
