import slugify from "slugify";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const boardRouter = router({
  addBoard: protectedProcedure
    .input(
      z
        .object({
          title: z.string(),
          color: z.enum(["CYAN", "PURPLE", "PINK", "YELLOW"]),
          userId: z.string().cuid(),
        })
        .strict()
    )
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.title, { trim: true, lower: true });
      const slugCount = await ctx.prisma.board.count({ where: { slug: slug } });
      if (slugCount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Similar title already exists",
        });
      }
      return ctx.prisma.board.create({ data: { ...input, slug } });
    }),
  updateBoard: protectedProcedure
    .input(
      z
        .object({
          id: z.string().cuid(),
          title: z.string(),
          color: z.enum(["CYAN", "PURPLE", "PINK", "YELLOW"]),
        })
        .strict()
    )
    .mutation(async ({ ctx, input: { id, title, color } }) => {
      const slug = slugify(title, { trim: true, lower: true });
      const slugCount = await ctx.prisma.board.count({ where: { slug: slug } });
      if (slugCount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Similar title already exists",
        });
      }
      return ctx.prisma.board.update({
        data: { title, color, slug },
        where: { id: id },
      });
    }),
  deleteBoard: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.board.delete({ where: { id: input } });
    }),
});
