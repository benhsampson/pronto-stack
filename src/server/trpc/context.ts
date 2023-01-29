import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Session } from "next-auth";

import { db } from "../db/client";
import { getServerAuthSession } from "../lib/getServerAuthSession";

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => ({
  session: opts.session,
  db,
});

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res });
  return await createContextInner({ session });
};

export type Context = inferAsyncReturnType<typeof createContext>;
