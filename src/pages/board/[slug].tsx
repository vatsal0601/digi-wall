import {
  Head,
  Navbar,
  PostCard,
  NotFoundSVG,
  CreatePost,
} from "../../components";
import { useState } from "react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "../../server/db/client";
import { useSearch } from "../../hooks";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Rubik } from "@next/font/google";
import { useRouter } from "next/router";
import { type Board, Post } from "@prisma/client";
import type { NextPage, GetServerSideProps } from "next";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

interface Props extends Board {
  posts: Post[];
}

const Post: NextPage<Props> = ({ id, title, color, slug, userId, posts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch, filteredList] = useSearch(posts, "title");

  const router = useRouter();

  const getBackgroundColor: () => string = () => {
    const colors = [
      { id: "CYAN", color: "bg-cyan-300/30" },
      { id: "PURPLE", color: "bg-purple-300/30" },
      { id: "PINK", color: "bg-pink-300/30" },
      { id: "YELLOW", color: "bg-yellow-300/30" },
    ] as const;

    for (const currentColor of colors) {
      if (currentColor.id === color) return currentColor.color;
    }

    return "bg-rose-300/30";
  };

  return (
    <>
      <Head title={title} />
      <Navbar
        setIsModalOpen={setIsModalOpen}
        setSearch={setSearch}
        type="post"
      />
      <CreatePost
        boardId={id}
        posts={posts}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editPostId={editId}
        setEditPostId={setEditId}
      />
      <main
        className={`min-h-screen py-24 font-sans lg:py-32 ${getBackgroundColor()} ${
          rubik.variable
        }`}
      >
        <section className="container space-y-4 lg:space-y-8">
          <div className="flex items-center space-x-1">
            <ChevronLeftIcon
              onClick={() => router.back()}
              className="h-7 w-7 flex-shrink-0 cursor-pointer text-gray-600 transition-all hover:stroke-2 active:text-rose-600"
            />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              Your Posts on {title}
            </h1>
          </div>
          {posts.length > 0 ? (
            <div className="columns-1 space-y-4 lg:columns-3 lg:space-y-8">
              {filteredList.map((post, index) => (
                <PostCard
                  key={index}
                  post={post}
                  setIsModalOpen={setIsModalOpen}
                  setEditPostId={setEditId}
                />
              ))}
            </div>
          ) : (
            <div className="mt-24 space-y-2 text-center">
              <NotFoundSVG className="mx-auto mt-2 w-3/5 sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/5" />
              <h2 className="text-sm font-semibold text-gray-900 lg:text-base">
                Noting here yet
              </h2>
              <p className="text-xs text-gray-600 lg:text-sm">
                Create your first post by clicking on the &apos;+&apos; button
                above
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Post;

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

  const { slug } = context.query;

  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }

  const boardData = await prisma.board.findFirst({
    where: { slug: slug },
    include: { posts: true },
  });

  if (!boardData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      session,
      ...boardData,
    },
  };
};
