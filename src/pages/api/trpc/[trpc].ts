import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createContext } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/routers/_app";

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ path, error }) => {
    if (env.NODE_ENV !== "development") return;
    console.error(`❌ tRPC failed on ${path}: ${error}`);
  },
});
