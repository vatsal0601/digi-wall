import { Head, Navbar, Card, CreateBoard } from "../../components";
import { useState } from "react";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "../../server/db/client";
import { useSearch } from "../../hooks";
import { Rubik } from "@next/font/google";
import { type Board } from "@prisma/client";
import type { NextPage, GetServerSideProps } from "next";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

interface Props {
  boards: Board[];
}

const Board: NextPage<Props> = ({ boards }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch, filteredList] = useSearch(boards, "title");

  const { data: session } = useSession();

  return (
    <>
      <Head title={`${session?.user?.name}'s Boards`} />
      <Navbar
        setIsModalOpen={setIsModalOpen}
        setSearch={setSearch}
        type="board"
      />
      <CreateBoard
        boards={boards}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editBoardId={editId}
        setEditBoardId={setEditId}
      />
      <main
        className={`container space-y-4 py-24 font-sans lg:space-y-8 lg:py-32 ${rubik.variable}`}
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
          My Boards
        </h1>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          {filteredList.map((board, index) => (
            <Card
              key={index}
              board={board}
              setIsModalOpen={setIsModalOpen}
              setEditId={setEditId}
            />
          ))}
        </section>
      </main>
    </>
  );
};

export default Board;

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

  const boards = await prisma.board.findMany({
    where: { userId: session?.user?.id },
  });

  return {
    props: {
      session,
      boards,
    },
  };
};
