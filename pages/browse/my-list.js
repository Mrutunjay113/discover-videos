import SectionCards from "@/components/card/section-cards";
import Navbar from "@/components/nav/navbar";
import Head from "next/head";
import styles from "../../styles/MyList.module.css";
import { getMyList } from "@/lib/videos";
import userRedirectUser from "@/utils/redirectUser";

export async function getServerSideProps(context) {
  const { userId, token } = await userRedirectUser(context);
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const videos = await getMyList(userId, token);
  return {
    props: {
      myListVideos: videos,
    },
  };
}

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
            shoudlScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;
