import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Rubik } from "@next/font/google";
import { trpc } from "../../utils";
import { useToast } from "../../contexts";
import type { Board } from "@prisma/client";
import type { FC, Dispatch, SetStateAction } from "react";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const colors = [
  { id: "CYAN", color: "bg-cyan-300", border: "border-cyan-600" },
  { id: "PURPLE", color: "bg-purple-300", border: "border-purple-600" },
  { id: "PINK", color: "bg-pink-300", border: "border-pink-600" },
  { id: "YELLOW", color: "bg-yellow-300", border: "border-yellow-600" },
] as const;

interface Props {
  boards: Board[];
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  editBoardId: string | null;
  setEditBoardId: Dispatch<SetStateAction<string | null>>;
}

const CreateBoard: FC<Props> = ({
  boards,
  isModalOpen,
  setIsModalOpen,
  editBoardId,
  setEditBoardId,
}) => {
  const [boardName, setBoardName] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const router = useRouter();

  const { data: session } = useSession();

  const { addToast } = useToast();

  const handleSuccess: (message: string) => void = (message) => {
    router.replace(router.asPath);
    setEditBoardId(null);
    setBoardName("");
    setSelectedColorIndex(0);
    addToast({ type: "success", message });
    setIsModalOpen(false);
  };

  const updateBoardQuery = trpc.board.updateBoard.useMutation({
    onSuccess: () => handleSuccess("Board updated successfully"),
    onError: (error, variables, context) => {
      setEditBoardId(null);
      addToast({ type: "error", message: error.message });
      setIsModalOpen(false);
    },
  });
  const createBoardQuery = trpc.board.addBoard.useMutation({
    onSuccess: () => handleSuccess("New board added successfully"),
    onError: (error, variables, context) => {
      setEditBoardId(null);
      addToast({ type: "error", message: error.message });
      setIsModalOpen(false);
    },
  });

  useEffect(() => {
    for (const board of boards) {
      if (board.id === editBoardId) {
        setBoardName(board.title);
        setSelectedColorIndex(
          colors.findIndex((color) => color.id === board.color)
        );
        break;
      }
    }
  }, [boards, editBoardId]);

  const handleSubmit = async () => {
    try {
      if (editBoardId !== null) {
        return updateBoardQuery.mutate({
          id: editBoardId,
          title: boardName.trim(),
          color: colors[selectedColorIndex]?.id ?? "CYAN",
        });
      }

      createBoardQuery.mutate({
        title: boardName.trim(),
        color: colors[selectedColorIndex]?.id ?? "CYAN",
        userId: session?.user?.id ?? "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditBoardId(null);
          setBoardName("");
          setSelectedColorIndex(0);
        }}
        className={`relative z-50 font-sans ${rubik.variable}`}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
            aria-hidden="true"
          ></div>
        </Transition.Child>
        <div className="fixed inset-0 mx-auto grid place-content-center">
          <Dialog.Panel className="mx-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:min-w-[30rem] lg:p-8">
            <div className="flex items-center justify-between space-x-4">
              <Dialog.Title
                as="h3"
                className="text-xl font-bold tracking-tight text-gray-900 lg:text-2xl"
              >
                {editBoardId !== null ? "Edit" : "Add a"} name{" "}
                {editBoardId !== null ? "of" : "for"} your board
              </Dialog.Title>
              <XMarkIcon
                onClick={() => {
                  setIsModalOpen(false);
                  setEditBoardId(null);
                  setBoardName("");
                  setSelectedColorIndex(0);
                }}
                className="h-5 w-5 cursor-pointer text-gray-600 lg:h-7 lg:w-7"
              />
            </div>
            <Dialog.Description>
              <input
                type="text"
                placeholder="Board name"
                onChange={(e) => setBoardName(e.target.value)}
                value={boardName}
                className="mb-4 mt-2 w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-600 transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring focus:ring-rose-600 lg:mb-8 lg:mt-4 lg:text-base"
              />
              <span className="block text-lg font-semibold text-gray-900 lg:text-xl">
                Select post color
              </span>
              <span className="block text-xs text-gray-700 lg:text-sm">
                Here are some templates to help you get started
              </span>
              <span className="mt-4 flex items-center space-x-2">
                {colors.map((color, index) => (
                  <span
                    key={index}
                    onClick={() => setSelectedColorIndex(index)}
                    className={`block h-5 w-5 cursor-pointer rounded-full border-2 transition-colors lg:h-6 lg:w-6 ${
                      color.color
                    } ${
                      selectedColorIndex === index
                        ? color.border
                        : "border-transparent"
                    }`}
                  ></span>
                ))}
              </span>
              <button
                onClick={handleSubmit}
                disabled={
                  createBoardQuery.isLoading ||
                  updateBoardQuery.isLoading ||
                  boardName === ""
                }
                className="ml-auto mt-4 block rounded-lg bg-rose-600 px-2 py-1 text-sm font-semibold text-white transition-colors active:bg-rose-700 disabled:bg-gray-400 disabled:text-gray-900 lg:mt-8 lg:px-4 lg:py-2 lg:text-base"
              >
                {createBoardQuery.isLoading || updateBoardQuery.isLoading
                  ? "Submitting..."
                  : `${editBoardId !== null ? "Edit" : "Create"} board`}
              </button>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateBoard;
