import Link from "next/link";
import Image from "next/image";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import { Fragment, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import { Rubik } from "@next/font/google";
import {
  HeartIcon,
  BookmarkIcon,
  GlobeAltIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import type { FC, Dispatch, SetStateAction, RefObject } from "react";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

interface Props {
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  setSearch?: Dispatch<SetStateAction<string>>;
  type?: "board" | "post";
}

const Navbar: FC<Props> = ({ setIsModalOpen, setSearch, type }) => {
  const { data: session } = useSession();

  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [toggleProfile, setToggleProfile] = useState(false);

  const ref: RefObject<HTMLDivElement> = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside: (event: any) => void = (event) => {
      if (ref.current && !ref.current.contains(event.target))
        setToggleProfile(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full border-b border-gray-200 bg-white py-2 font-sans lg:py-4 ${rubik.variable}`}
      >
        <nav className="container flex items-center justify-between">
          <ul className="flex items-center space-x-4 lg:space-x-8">
            <li>
              <Link
                href={"/"}
                className="text-3xl font-bold tracking-tight text-gray-900 transition-colors active:text-rose-600 lg:text-4xl"
              >
                <span className="text-rose-600">Digi</span>Wall
              </Link>
            </li>
            {session?.user && setSearch && (
              <li className="relative hidden lg:block">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 transform text-gray-500" />
                <input
                  type="search"
                  placeholder="Search.."
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-96 rounded-lg border border-gray-200 p-2 pl-10 text-gray-600 transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring focus:ring-rose-600"
                />
              </li>
            )}
          </ul>
          {session?.user ? (
            <ul className="relative flex items-center space-x-4 lg:space-x-8">
              {setIsModalOpen ? (
                <li>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center space-x-1 rounded-lg bg-rose-600 px-2 py-1 text-white transition-colors active:bg-rose-700 lg:px-4 lg:py-2"
                  >
                    <PlusIcon className="h-7 w-7 stroke-2" />
                    <span className="hidden font-semibold lg:inline-block">
                      Create new {type}
                    </span>
                  </button>
                </li>
              ) : (
                <Link
                  href={"/board"}
                  className="inline-flex items-center justify-center space-x-1 rounded-lg bg-rose-100 px-2 py-1 text-sm font-normal text-gray-600 transition-colors active:text-rose-600 lg:px-4 lg:py-2 lg:text-base"
                >
                  <WalletIcon className="h-4 w-4 stroke-2 lg:h-5 lg:w-5" />
                  <span>My boards</span>
                </Link>
              )}
              <button
                onClick={() =>
                  setToggleProfile((toggleProfile) => !toggleProfile)
                }
                className={`relative h-10 w-10 rounded-full bg-gray-200 lg:h-12 lg:w-12 ${
                  isAvatarLoading ? "animate-pulse" : ""
                }`}
              >
                <Image
                  src={
                    session?.user?.image ??
                    `https://ui-avatars.com/api/name=${
                      session?.user?.name ?? "Unknown Name"
                    }?&background=random`
                  }
                  alt={session?.user?.name ?? "Unknown Name"}
                  fill={true}
                  className="h-full w-full rounded-full object-cover"
                  onLoad={() => setIsAvatarLoading(false)}
                />
              </button>
              <Transition
                as={Fragment}
                show={toggleProfile}
                enter="transform transition duration-150"
                enterFrom="-translate-y-1/4 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transform transition duration-150"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="-translate-y-1/4 opacity-0"
              >
                <div
                  ref={ref}
                  className="absolute top-14 right-0 z-50 w-48 space-y-2 rounded-lg border border-gray-200 bg-white p-4 text-center shadow-md lg:top-20 lg:w-64 lg:space-y-4 lg:p-8"
                >
                  <button
                    onClick={() =>
                      setToggleProfile((toggleProfile) => !toggleProfile)
                    }
                    className="absolute top-4 right-4 rounded-lg p-0.5"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-900 lg:h-5 lg:w-5" />
                  </button>
                  <div className="mx-auto w-fit rounded-full border-2 border-rose-600 p-1">
                    <div
                      className={`relative h-16 w-16 rounded-full bg-gray-200 lg:h-24 lg:w-24 ${
                        isAvatarLoading ? "animate-pulse" : ""
                      }`}
                    >
                      <Image
                        src={
                          session?.user?.image ??
                          `https://ui-avatars.com/api/name=${
                            session?.user?.name ?? "Unknown Name"
                          }?&background=random`
                        }
                        alt={session?.user?.name ?? "Unknown Name"}
                        fill={true}
                        className="h-full w-full rounded-full object-cover"
                        onLoad={() => setIsAvatarLoading(false)}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 lg:text-xl">
                      {session?.user?.name ?? "Unknown Name"}
                    </p>
                    <p className="select-all break-words text-sm text-gray-600 lg:text-base">
                      {session?.user?.email ?? "email@email.com"}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={"/explore"}
                      className="inline-flex items-center justify-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm font-normal text-gray-600 transition-colors active:text-blue-600 lg:px-4 lg:py-2 lg:text-base"
                    >
                      {router.pathname === "/explore" ? (
                        <GlobeAltIconSolid className="h-4 w-4 text-blue-600 lg:h-5 lg:w-5" />
                      ) : (
                        <GlobeAltIcon className="h-4 w-4 stroke-2 lg:h-5 lg:w-5" />
                      )}
                      <span
                        className={
                          router.pathname === "/explore"
                            ? "font-semibold text-blue-600"
                            : ""
                        }
                      >
                        Explore
                      </span>
                    </Link>
                    <Link
                      href={"/bookmark"}
                      className="inline-flex items-center justify-center space-x-1 rounded-lg bg-yellow-100 px-2 py-1 text-sm font-normal text-gray-600 transition-colors active:text-yellow-600 lg:px-4 lg:py-2 lg:text-base"
                    >
                      {router.pathname === "/bookmark" ? (
                        <BookmarkIconSolid className="h-4 w-4 text-yellow-600 lg:h-5 lg:w-5" />
                      ) : (
                        <BookmarkIcon className="h-4 w-4 stroke-2 lg:h-5 lg:w-5" />
                      )}
                      <span
                        className={
                          router.pathname === "/bookmark"
                            ? "font-semibold text-yellow-600"
                            : ""
                        }
                      >
                        My bookmarks
                      </span>
                    </Link>
                    <Link
                      href={"/like"}
                      className="inline-flex items-center justify-center space-x-1 rounded-lg bg-rose-100 px-2 py-1 text-sm font-normal text-gray-600 transition-colors active:text-rose-600 lg:px-4 lg:py-2 lg:text-base"
                    >
                      {router.pathname === "/like" ? (
                        <HeartIconSolid className="h-4 w-4 text-rose-600 lg:h-5 lg:w-5" />
                      ) : (
                        <HeartIcon className="h-4 w-4 stroke-2 lg:h-5 lg:w-5" />
                      )}
                      <span
                        className={
                          router.pathname === "/like"
                            ? "font-semibold text-rose-600"
                            : ""
                        }
                      >
                        My likes
                      </span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="rounded-lg bg-rose-600 px-2 py-1 text-sm font-semibold text-white transition-colors active:bg-rose-700 lg:px-4 lg:py-2 lg:text-base"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </Transition>
            </ul>
          ) : (
            <ul className="relative flex items-center space-x-4 lg:space-x-8">
              <li>
                <Link
                  href={"/explore"}
                  className="rounded-lg px-2 py-1 text-sm font-normal text-gray-600 transition-colors hover:bg-rose-100 active:text-rose-600 lg:px-4 lg:py-2 lg:text-base"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href={"/onboard"}
                  className="rounded-lg bg-rose-600 px-2 py-1 text-sm font-semibold text-white transition-colors active:bg-rose-700 lg:px-4 lg:py-2 lg:text-base"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
