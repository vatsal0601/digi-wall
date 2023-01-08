import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Rubik } from "@next/font/google";
import { trpc } from "../../utils";
import { env } from "../../env/client.mjs";
import { useToast } from "../../contexts";
import { type Post } from "@prisma/client";
import type { FC, Dispatch, SetStateAction } from "react";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

interface Props {
  posts: Post[];
  boardId: string;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  editPostId: string | null;
  setEditPostId: Dispatch<SetStateAction<string | null>>;
}

const CreatePost: FC<Props> = ({
  posts,
  boardId,
  isModalOpen,
  setIsModalOpen,
  editPostId,
  setEditPostId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const router = useRouter();

  const { addToast } = useToast();

  useEffect(() => {
    for (const post of posts) {
      if (post.id === editPostId) {
        setTitle(post.title);
        setDescription(post.description);
        break;
      }
    }
  }, [posts, editPostId]);

  const handleSuccess: (message: string) => void = (message) => {
    router.replace(router.asPath);
    setEditPostId(null);
    setTitle("");
    setDescription("");
    setImage(null);
    addToast({ type: "success", message });
    setIsModalOpen(false);
  };

  const createPostQuery = trpc.post.addPost.useMutation({
    onSuccess: () => handleSuccess("New post created successfully"),
    onError: (error, variables, context) => {
      setEditPostId(null);
      addToast({ type: "error", message: error.message });
      setIsModalOpen(false);
    },
  });
  const updatePostQuery = trpc.post.updatePost.useMutation({
    onSuccess: () => handleSuccess("Post updated successfully"),
    onError: (error, variables, context) => {
      setEditPostId(null);
      addToast({ type: "error", message: error.message });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = async () => {
    const uploadImage: () => Promise<string> = async () => {
      if (!image) return;
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", env.NEXT_PUBLIC_CLOUDINARY_PRESET);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/vatsal-cloud/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    };

    try {
      if (editPostId !== null) {
        if (image) {
          const imageUrl = await uploadImage();
          return updatePostQuery.mutate({
            title,
            description,
            image: imageUrl,
            id: editPostId,
          });
        }
        return updatePostQuery.mutate({
          title,
          description,
          id: editPostId,
        });
      }
      if (image) {
        const imageUrl = await uploadImage();
        return createPostQuery.mutate({
          title,
          description,
          image: imageUrl,
          boardId: boardId,
        });
      }
      return createPostQuery.mutate({
        title,
        description,
        boardId: boardId,
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
          setEditPostId(null);
          setTitle("");
          setDescription("");
          setImage(null);
          setIsModalOpen(false);
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
                {editPostId !== null ? "Edit your" : "Create a"} post
              </Dialog.Title>
              <XMarkIcon
                onClick={() => {
                  setEditPostId(null);
                  setTitle("");
                  setDescription("");
                  setImage(null);
                  setIsModalOpen(false);
                }}
                className="h-5 w-5 cursor-pointer text-gray-600 lg:h-7 lg:w-7"
              />
            </div>
            <Dialog.Description>
              <span className="mb-4 block text-xs text-gray-600 lg:mb-8 lg:text-sm">
                Write something for your post
              </span>
              <span className="divide-y divide-gray-200">
                <span className="block space-y-1 pb-4 lg:pb-8">
                  <label className="text-sm font-semibold text-gray-900 lg:text-base">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Subject"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-600 transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring focus:ring-rose-600 lg:text-base"
                  />
                  <span className="block pt-3">
                    <label
                      htmlFor="image"
                      className="flex w-max cursor-pointer items-center space-x-1 rounded-lg border border-gray-200 px-2 py-1"
                    >
                      <PhotoIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600 lg:text-base">
                        {image ? image.name : "Add your image"}
                      </span>
                    </label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImage(
                          e.target.files ? e.target.files[0] ?? null : null
                        )
                      }
                      className="hidden"
                    />
                  </span>
                </span>
                <span className="block space-y-1 pt-4 lg:pt-8">
                  <label className="text-sm font-semibold text-gray-900 lg:text-base">
                    What&apos;s on your mind?
                  </label>
                  <textarea
                    placeholder="Subject"
                    rows={5}
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="w-full resize-none rounded-lg border border-gray-200 p-2 text-sm text-gray-600 transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring focus:ring-rose-600 lg:text-base"
                  ></textarea>
                </span>
              </span>
              <button
                onClick={handleSubmit}
                disabled={
                  createPostQuery.isLoading ||
                  updatePostQuery.isLoading ||
                  title === "" ||
                  description === ""
                }
                className="ml-auto mt-4 block rounded-lg bg-rose-600 px-2 py-1 text-sm font-semibold text-white transition-colors active:bg-rose-700 disabled:bg-gray-400 disabled:text-gray-900 lg:mt-8 lg:px-4 lg:py-2 lg:text-base"
              >
                {createPostQuery.isLoading || updatePostQuery.isLoading
                  ? "Submitting..."
                  : `${editPostId !== null ? "Edit" : "Create"} post`}
              </button>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreatePost;
