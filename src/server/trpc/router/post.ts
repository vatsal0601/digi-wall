import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  addPost: protectedProcedure
    .input(
      z
        .object({
          title: z.string(),
          description: z.string(),
          image: z.string().url().optional(),
          boardId: z.string().cuid(),
        })
        .strict()
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: { ...input } });
    }),
  updatePost: protectedProcedure
    .input(
      z
        .object({
          id: z.string().cuid(),
          title: z.string(),
          description: z.string(),
          image: z.string().url().optional(),
        })
        .strict()
    )
    .mutation(({ ctx, input: { id, title, description, image } }) => {
      if (image)
        return ctx.prisma.post.update({
          data: { title, description, image },
          where: { id },
        });
      return ctx.prisma.post.update({
        data: { title, description },
        where: { id },
      });
    }),
  deletePost: protectedProcedure
    .input(z.string().cuid())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.delete({ where: { id: input } });
    }),
  getLike: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().cuid(),
          postId: z.string().cuid(),
        })
        .strict()
    )
    .query(async ({ ctx, input: { userId, postId } }) => {
      const likes = await ctx.prisma.like.count({
        where: { postId },
      });
      const isLikedByUser = await ctx.prisma.like.findFirst({
        where: { postId, userId },
      });
      return { isLikedByUser: isLikedByUser?.id ?? null, likes };
    }),
  addLike: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().cuid(),
          postId: z.string().cuid(),
        })
        .strict()
    )
    .mutation(({ ctx, input: { userId, postId } }) => {
      return ctx.prisma.like.create({ data: { userId, postId } });
    }),
  removeLike: protectedProcedure
    .input(z.string().cuid())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.like.delete({ where: { id: input } });
    }),
  getBookmark: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().cuid(),
          postId: z.string().cuid(),
        })
        .strict()
    )
    .query(async ({ ctx, input: { userId, postId } }) => {
      const bookmarks = await ctx.prisma.bookmark.count({
        where: { postId: postId },
      });
      const isBookmarkedByUser = await ctx.prisma.bookmark.findFirst({
        where: { postId, userId },
      });
      return {
        isBookmarkedByUser: isBookmarkedByUser?.id ?? null,
        bookmarks: bookmarks,
      };
    }),
  addBookmark: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().cuid(),
          postId: z.string().cuid(),
        })
        .strict()
    )
    .mutation(({ ctx, input: { userId, postId } }) => {
      return ctx.prisma.bookmark.create({ data: { userId, postId } });
    }),
  removeBookmark: protectedProcedure
    .input(z.string().cuid())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bookmark.delete({ where: { id: input } });
    }),
});
