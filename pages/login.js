import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../styles/Login.module.css";
import { magic } from "../lib/magic-client";
import { log } from "react-modal/lib/helpers/ariaAppHider";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const router = useRouter();
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    const email = e.target.value;
    setEmail(email);
  };
  const handleLoginWithEmail = async (e) => {
    e.preventDefault();

    if (email) {
      // log in a user by their email
      try {
        setIsLoading(true);
        const didToken = await magic.auth.loginWithMagicLink({
          email,
        });
        console.log({ didToken });
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });
          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            console.log({ loggedInResponse });
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something went Wrong logging in");
          }
        }
      } catch (err) {
        // Handle errors if required!
        console.log("Something went Wrong", err);
        setIsLoading(false);
      }

      //route to dashboard
    } else {
      //show erroe msg
      setIsLoading(false);
      setUserMsg("Enter a valid email address");
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                width="128"
                height="34"
                alt="Netflix logo"
              />
            </div>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            name="email"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
