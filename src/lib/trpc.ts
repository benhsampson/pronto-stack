import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";

import { AppRouter } from "../server/trpc/routers/_app";

const getBaseUrl = () => {
  const isSSR = typeof window === "undefined";
  if (!isSSR) return "";
  if (process.env.HOST_DOMAIN) return `https://${process.env.HOST_DOMAIN}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCNext<AppRouter>({
  config: () => ({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
      }),
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),
      }),
    ],
  }),
  ssr: true,
});
