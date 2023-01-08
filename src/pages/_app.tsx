import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "../contexts";
import { ToastContainer } from "../components";
import { trpc } from "../utils";
import { Footer } from "../components";
import { type Session } from "next-auth";
import { type AppType } from "next/app";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <ToastProvider>
          <ToastContainer />
          <Component {...pageProps} />
        </ToastProvider>
      </SessionProvider>
      <Footer />
    </>
  );
};

export default trpc.withTRPC(MyApp);
