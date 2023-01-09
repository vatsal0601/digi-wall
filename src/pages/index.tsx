import Link from "next/link";
import { Head, Navbar, HeroSVG } from "../components";
import { Rubik } from "@next/font/google";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { type NextPage } from "next";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const Home: NextPage = () => {
  return (
    <>
      <Head />
      <Navbar />
      <main className={`font-sans ${rubik.variable}`}>
        <section className="relative grid h-screen place-content-center overflow-hidden">
          <HeroSVG className="absolute inset-0 -z-10 scale-150 opacity-30 blur-lg" />
          <div className="mx-auto max-w-md space-y-1 px-5 text-center md:px-10 lg:max-w-xl lg:space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              Digital organization made easy!
            </h1>
            <p className="text-gray-600 lg:text-lg">
              Create digital boards in our app and stay organized by managing
              your ideas, projects and tasks. Each board can contain a variety
              of posts, such as notes, and images, making it a versatile and
              convenient tool.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Link
                href={"/onboard"}
                className="rounded-lg bg-rose-600 py-2 px-4 text-sm font-semibold text-white transition-colors active:bg-rose-700 lg:text-base"
              >
                <span>Get Started</span>
              </Link>
              <Link
                href={"/explore"}
                className="inline-flex items-center space-x-1 rounded-lg px-4 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-100 lg:text-base"
              >
                <span>Explore</span>
                <ArrowRightIcon className="h-4 w-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
