import { HeartIcon } from "@heroicons/react/24/solid";
import { Rubik } from "@next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const Footer = () => {
  return (
    <footer
      className={`absolute bottom-0 flex w-full items-center justify-center space-x-1 border-t border-gray-200 bg-white py-2 text-center font-sans lg:py-4 ${rubik.variable}`}
    >
      <span>Made with</span>
      <HeartIcon className="h-4 w-4 text-rose-600" />
      <span>by Vatsal Sakariya</span>
    </footer>
  );
};
export default Footer;
