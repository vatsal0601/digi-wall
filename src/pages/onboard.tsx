import { unstable_getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { LoginSVG, GoogleIcon } from "../components";
import { Rubik } from "@next/font/google";
import { type GetServerSideProps } from "next";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const OnBoard = () => {
  return (
    <>
      <main
        className={`container grid min-h-screen place-content-center font-sans ${rubik.variable}`}
      >
        <section className="space-y-4 rounded-lg border border-gray-200 p-4 lg:w-[30rem] lg:space-y-8">
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
            Getting Started
          </h1>
          <LoginSVG className="w-full lg:mx-auto lg:w-4/5" />
          <form onSubmit={(e) => e.preventDefault()}>
            <button
              onClick={() => signIn("google")}
              className="inline-flex w-full items-center justify-center space-x-2 rounded-lg bg-rose-600 px-2 py-1 text-white transition-colors active:bg-rose-700 lg:px-4 lg:py-2"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Get Started with Google</span>
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default OnBoard;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
