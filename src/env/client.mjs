import { clientEnv, clientSchema } from "./schema.mjs";
import { formatErrors } from "./utils.mjs";

const _clientEnv = clientSchema.safeParse(clientEnv);

if (!_clientEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_clientEnv.error.format()),
  );
  throw new Error("Invalid environment variables");
}

for (const key of Object.keys(_clientEnv.data)) {
  if (!key.startsWith("NEXT_PUBLIC_")) {
    console.warn(`❌ ${key} does not begin with NEXT_PUBLIC_`);
    throw new Error("Invalid environment variable name");
  }
}

export const env = _clientEnv.data;
