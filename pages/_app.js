import Loading from "@/components/loading/loading";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { magic } from "../lib/magic-client";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const handleLoggedIn = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      setIsLoading(false);
      if (isLoggedIn) {
        //  Route to /
        setIsLoading(false);
        router.push("/");
      } else {
        // to /login
        setIsLoading(false);
        router.push("/login");
      }
    };
    handleLoggedIn();
  }, []);
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  //return <Component {...pageProps} />;
  return isLoading ? <Loading /> : <Component {...pageProps} />;
}
