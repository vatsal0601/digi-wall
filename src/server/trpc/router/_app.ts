import { router } from "../trpc";
import { authRouter } from "./auth";
import { boardRouter } from "./board";
import { postRouter } from "./post";

export const appRouter = router({
  board: boardRouter,
  post: postRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
