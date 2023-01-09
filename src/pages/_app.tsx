import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "../contexts";
import { ToastContainer } from "../components";
import { trpc } from "../utils";
import { Footer } from "../components";
import { useRouter } from "next/router";
import { start, done, configure } from "nprogress";
import { useEffect } from "react";
import { type Session } from "next-auth";
import { type AppType } from "next/app";
import "../styles/globals.css";
import "../styles/nprogress.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  configure({ showSpinner: false });

  useEffect(() => {
    router.events.on("routeChangeStart", () => start());
    router.events.on("routeChangeComplete", () => done());
    router.events.on("routeChangeError", () => done());

    return () => {
      router.events.off("routeChangeStart", () => start());
      router.events.off("routeChangeComplete", () => done());
      router.events.off("routeChangeError", () => done());
    };
  }, [router.events]);

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
