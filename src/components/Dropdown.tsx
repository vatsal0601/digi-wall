import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useToast } from "../contexts";
import { trpc } from "../utils";
import type { FC, Dispatch, SetStateAction } from "react";

interface Props {
  id: string;
  type: "board" | "post";
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string | null>>;
}

const DropDown: FC<Props> = ({ id, type, setIsModalOpen, setEditId }) => {
  const router = useRouter();
  const { addToast } = useToast();

  const deleteBoardQuery = trpc.board.deleteBoard.useMutation({
    onSuccess: () => {
      router.replace(router.asPath);
      addToast({ type: "success", message: "Board deleted sucessfully" });
    },
    onError: (error, variables, context) => {
      addToast({ type: "error", message: error.message });
    },
  });
  const deletePostQuery = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      router.replace(router.asPath);
      addToast({ type: "success", message: "Post deleted sucessfully" });
    },
    onError: (error, variables, context) => {
      addToast({ type: "error", message: error.message });
    },
  });

  const handleRemove: () => void = async () => {
    try {
      if (type === "board") return deleteBoardQuery.mutate(id);
      deletePostQuery.mutate(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Menu
      as="div"
      className={`absolute right-4 ${
        type === "board" ? "top-1/2" : "top-8"
      } z-10 -translate-y-2 transform`}
    >
      <Menu.Button>
        <EllipsisVerticalIcon className="z-10 h-5 w-5 text-gray-600 transition-all active:stroke-2" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-20 w-28 space-y-2 rounded-lg border border-gray-200 bg-white p-2 shadow-md">
          <Menu.Item
            as="button"
            onClick={() => {
              setEditId(id);
              setIsModalOpen(true);
            }}
            className="flex w-full items-center space-x-1 rounded-lg px-2 py-1 text-gray-900 transition-colors hover:bg-rose-600 hover:text-white"
          >
            <PencilSquareIcon className="h-4 w-4" />
            <span className="text-xs lg:text-sm">Edit</span>
          </Menu.Item>
          <Menu.Item
            as="button"
            onClick={() => handleRemove()}
            disabled={deleteBoardQuery.isLoading}
            className="flex w-full items-center space-x-1 rounded-lg px-2 py-1 text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:bg-gray-600 disabled:text-gray-900"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="text-xs lg:text-sm">
              {deleteBoardQuery.isLoading ? "Deleting..." : "Delete"}
            </span>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropDown;
