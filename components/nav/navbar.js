import Link from "next/link";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { magic } from "../../lib/magic-client";

const Navbar = () => {
  const router = useRouter();
  const [showDropdown, setDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [didToken, setDidToken] = useState("");
  const [username, setUsername] = useState("Email");

  useEffect(() => {
    async function getUsername() {
      try {
        const { email } = await magic.user.getMetadata();
        const didToken = magic.user.getIdToken();
        if (email) {
          setUsername(email);
        }
      } catch (error) {
        setIsLoggedIn(false);
        console.log("Error retrieving email:", error);
      }
    }
    getUsername();
  }, []);

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      console.log({ res });
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
  };

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };
  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };
  const handleShowDropdown = (e) => {
    e.preventDefault();
    setDropdown(!showDropdown);
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            MyList
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              <Image
                src={"/static/expand_more.svg"}
                width="24"
                height="24"
                alt="expand icon"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <Link
                    className={styles.linkName}
                    href="/login"
                    onClick={handleSignout}
                  >
                    {isLoggedIn ? "Sign out" : "Sign In"}
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};
export default Navbar;
