import Toast from "./Toast";
import { useToast } from "../contexts";
import { Rubik } from "@next/font/google";
import type { FC } from "react";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const ToastContainer: FC = () => {
  const { toasts } = useToast();

  return (
    <ul
      className={`fixed bottom-20 left-4 z-50 w-64 space-y-2 font-sans lg:left-8 lg:w-96 lg:space-y-4 ${rubik.variable}`}
    >
      {toasts.map(({ id, type, message }, index) => (
        <Toast key={index} id={id} type={type} message={message} />
      ))}
    </ul>
  );
};

export default ToastContainer;
