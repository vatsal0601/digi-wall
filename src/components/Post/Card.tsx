import Image from "next/image";
import DropDown from "../Dropdown";
import { Loading } from "../SVG";
import { useState } from "react";
import { HeartIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils";
import type { Post, Board, User } from "@prisma/client";
import type { FC, Dispatch, SetStateAction } from "react";

interface Props {
  post: Post;
  board?: Board;
  user?: User;
  setEditPostId?: Dispatch<SetStateAction<string | null>>;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
}

const PostCard: FC<Props> = ({
  post,
  board,
  user,
  setEditPostId,
  setIsModalOpen,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const { data: session } = useSession();

  const getLikeQuery = trpc.post.getLike.useQuery(
    {
      userId: session?.user?.id ?? "",
      postId: post.id,
    },
    {
      onSuccess: (data) => {
        setLikeId(data.isLikedByUser);
        setLikeCount(data.likes);
      },
      enabled: !!session?.user?.id,
    }
  );
  const addLikeQuery = trpc.post.addLike.useMutation({
    onSuccess: () => {
      getLikeQuery.refetch();
    },
  });
  const removeLikeQuery = trpc.post.removeLike.useMutation({
    onSuccess: () => {
      getLikeQuery.refetch();
    },
  });

  const getBookmarkQuery = trpc.post.getBookmark.useQuery(
    {
      userId: session?.user?.id ?? "",
      postId: post.id,
    },
    {
      onSuccess: (data) => {
        setBookmarkId(data.isBookmarkedByUser);
      },
      enabled: !!session?.user?.id,
    }
  );
  const addBookmarkQuery = trpc.post.addBookmark.useMutation({
    onSuccess: () => {
      getBookmarkQuery.refetch();
    },
  });
  const removeBookmarkQuery = trpc.post.removeBookmark.useMutation({
    onSuccess: () => {
      getBookmarkQuery.refetch();
    },
  });

  const getColor: () => string | undefined = () => {
    if (!board) return;

    const colors = [
      { id: "CYAN", color: "bg-cyan-300/30 divide-cyan-400" },
      { id: "PURPLE", color: "bg-purple-300/30 divide-purple-400" },
      { id: "PINK", color: "bg-pink-300/30 divide-pink-400" },
      { id: "YELLOW", color: "bg-yellow-300/30 divide-yellow-400" },
    ] as const;

    for (const currentColor of colors) {
      if (currentColor.id === board.color) return currentColor.color;
    }

    return "bg-rose-300/30";
  };

  return (
    <div
      className={`relative flex break-inside-avoid-column flex-col justify-between divide-y rounded-lg p-4 transition-shadow hover:shadow-md ${
        board ? `${getColor()}` : "divide-gray-200 bg-white"
      }`}
    >
      <div className="pb-2 lg:pb-4">
        <div className="mb-2 pr-12 lg:mb-4">
          <h3 className="text-lg font-bold tracking-tight lg:text-xl">
            {post.title}
          </h3>
          {board && (
            <span className="block text-xs font-light text-gray-600 lg:text-sm">
              From {board.title}
            </span>
          )}
          {user && (
            <span className="block text-xs font-light text-gray-600 lg:text-sm">
              By {user.email}
            </span>
          )}
        </div>
        {session &&
          (getBookmarkQuery.isLoading ||
          addBookmarkQuery.isLoading ||
          removeBookmarkQuery.isLoading ? (
            <Loading
              className={`absolute top-6 h-5 w-5 text-yellow-300 ${
                board ? "right-6" : "right-10"
              }`}
            />
          ) : bookmarkId ? (
            <BookmarkIconSolid
              onClick={() => {
                removeBookmarkQuery.mutate(bookmarkId);
              }}
              className={`absolute top-6 h-5 w-5 cursor-pointer text-yellow-300 ${
                board ? "right-6" : "right-10"
              }`}
            />
          ) : (
            <BookmarkIcon
              onClick={() => {
                addBookmarkQuery.mutate({
                  userId: session?.user?.id ?? "",
                  postId: post.id,
                });
              }}
              className={`absolute top-6 h-5 w-5 cursor-pointer text-gray-600 transition-all hover:stroke-2 hover:text-yellow-300 ${
                board ? "right-6" : "right-10"
              }`}
            />
          ))}
        {setEditPostId && setIsModalOpen && (
          <DropDown
            id={post.id}
            type="post"
            imageUrl={post.image}
            setEditId={setEditPostId}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {post.image && (
          <div
            className={`relative mb-2 aspect-video object-cover lg:mb-4 ${
              isImageLoading ? "animate-pulse" : ""
            }`}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill={true}
              className="h-full w-full rounded-lg object-cover"
              onLoad={() => setIsImageLoading(false)}
            />
          </div>
        )}
        <p className="text-sm text-gray-600 lg:text-base">{post.description}</p>
      </div>
      {session && (
        <div className="flex items-center space-x-1 pt-2">
          {getLikeQuery.isLoading ||
          addLikeQuery.isLoading ||
          removeLikeQuery.isLoading ? (
            <Loading className="h-5 w-5 text-rose-600" />
          ) : likeId ? (
            <HeartIconSolid
              onClick={() => {
                removeLikeQuery.mutate(likeId);
              }}
              className="h-5 w-5 cursor-pointer text-rose-600"
            />
          ) : (
            <HeartIcon
              onClick={() => {
                addLikeQuery.mutate({
                  userId: session?.user?.id ?? "",
                  postId: post.id,
                });
              }}
              className="h-5 w-5 cursor-pointer text-gray-600 transition-all hover:stroke-2 hover:text-rose-600"
            />
          )}
          <span className="text-sm font-semibold text-gray-600 lg:text-base">
            {likeCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default PostCard;
