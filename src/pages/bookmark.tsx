import { Head, Navbar, PostCard, NotFoundSVG } from "../components";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { prisma } from "../server/db/client";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Rubik } from "@next/font/google";
import type { Bookmark, Post, Board } from "@prisma/client";
import type { NextPage, GetServerSideProps } from "next";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

interface Props {
  bookmarks: (Bookmark & {
    post: Post & {
      Board: Board;
    };
  })[];
}

const BookmarkPage: NextPage<Props> = ({ bookmarks }) => {
  const { data: session } = useSession();

  return (
    <>
      <Head title={`${session?.user?.name}'s Bookmarks`} />
      <Navbar />
      <main
        className={`container space-y-4 py-24 font-sans lg:space-y-8 lg:py-32 ${rubik.variable}`}
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
          My Bookmarks
        </h1>
        <section>
          {bookmarks.length > 0 ? (
            <div className="columns-1 space-y-4 lg:columns-3 lg:space-y-8">
              {bookmarks.map((bookmark, index) => (
                <PostCard
                  key={index}
                  post={bookmark.post}
                  board={bookmark.post.Board}
                />
              ))}
            </div>
          ) : (
            <div className="mt-24 space-y-2 text-center">
              <NotFoundSVG className="mx-auto mt-2 w-3/5 sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/5" />
              <h2 className="text-sm font-semibold text-gray-900 lg:text-base">
                Noting here yet
              </h2>
              <p className="flex items-center justify-center text-xs text-gray-600 lg:text-sm">
                <span>Bookmark your first post by clicking on the &apos;</span>
                <BookmarkIcon className="h-4 w-4 stroke-2" />
                <span>&apos; button</span>
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default BookmarkPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user?.id },
    include: { post: { include: { Board: true } } },
    orderBy: {
      post: {
        title: "asc",
      },
    },
  });

  return {
    props: {
      session,
      bookmarks,
    },
  };
};
