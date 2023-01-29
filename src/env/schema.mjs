import { z } from "zod";

export const serverSchema = z.object({
  NODE_ENV: z.enum(["testing", "development", "production"]),
  HOST_DOMAIN: z.string().optional(),
  PORT: z.number().optional(),
  DATABASE_URL: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
});

export const clientSchema = z.object({
  // NEXT_PUBLIC_CLIENT_VAR: z.string(),
});

/**
 * We have to deconstruct process.env manually since Next.js evaluates process.env
 * at build time and only the environment variables that are actually used are
 * included in the build. Since we never use these env variables on the server,
 * they are not included in our build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_CLIENT_VAR: process.env.NEXT_PUBLIC_CLIENT_VAR,
};
