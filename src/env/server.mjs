import { clientEnv, serverSchema } from "./schema.mjs";
import { formatErrors } from "./utils.mjs";

const _serverEnv = serverSchema.safeParse(process.env);

if (!_serverEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_serverEnv.error.format()),
  );
  throw new Error("Invalid environment variables");
}

for (const key of Object.keys(_serverEnv.data)) {
  if (key.startsWith("NEXT_PUBLIC_")) {
    console.warn(`❌ ${key} cannot begin with NEXT_PUBLIC_`);
    throw new Error("Exposing server-side env variables");
  }
}

export const env = { ..._serverEnv.data, ...clientEnv };
