import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(tasks).values({
        title: input.title,
      }).returning();
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(tasks).orderBy(tasks.createdAt);
  }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
    }),
});
