import { publicProcedure, router } from "../trpc";

export const usersRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db
      .selectFrom("users")
      .select(["id", "name", "image"])
      .limit(10)
      .execute();
    return users;
  }),
});
