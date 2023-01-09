import { Head, Navbar, PostCard } from "../components";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "../server/db/client";
import { Rubik } from "@next/font/google";
import type { Post, Board, User } from "@prisma/client";
import type { NextPage, GetServerSideProps } from "next";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

interface Props {
  posts: (Post & {
    Board: Board & {
      User: User;
    };
  })[];
}

const BookmarkPage: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <Head title="Explore" />
      <Navbar />
      <main
        className={`container space-y-4 py-24 font-sans lg:space-y-8 lg:py-32 ${rubik.variable}`}
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
          Explore
        </h1>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          {posts.map((post, index) => (
            <PostCard
              key={index}
              post={post}
              board={post.Board}
              user={post.Board.User}
            />
          ))}
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

  const posts = await prisma.post.findMany({
    include: { Board: { include: { User: true } } },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
  });

  return {
    props: {
      session,
      posts,
    },
  };
};
