import Link from "next/link";
import DropDown from "../Dropdown";
import type { Board } from "@prisma/client";
import type { FC, Dispatch, SetStateAction } from "react";

interface Props {
  board: Board;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string | null>>;
}

const Card: FC<Props> = ({ board, setIsModalOpen, setEditId }) => {
  const handleColor: () => string = () => {
    switch (board.color) {
      case "CYAN":
        return "bg-cyan-300";
      case "PINK":
        return "bg-pink-300";
      case "PURPLE":
        return "bg-purple-300";
      case "YELLOW":
        return "bg-yellow-300";
      default:
        return "bg-rose-300";
    }
  };

  return (
    <div className="relative flex items-center rounded-lg border border-gray-200 pr-8 transition-shadow hover:shadow-md">
      <span
        className={`block h-20 w-20 flex-shrink-0 rounded-l-lg ${handleColor()}`}
      ></span>
      <Link
        href={`/board/${board.slug}`}
        className="ml-4 truncate text-sm font-semibold text-gray-900 transition-colors hover:underline active:text-rose-600"
      >
        {board.title}
      </Link>
      <DropDown
        id={board.id}
        type="board"
        setIsModalOpen={setIsModalOpen}
        setEditId={setEditId}
      />
    </div>
  );
};

export default Card;
