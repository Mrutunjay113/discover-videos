import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner/banner";
import Navbar from "@/components/nav/navbar";
import SectionCards from "@/components/card/section-cards";
import {
  getVideos,
  getPopularVideos,
  getWatchItAgainVideos,
} from "@/lib/videos";

import userRedirectUser from "@/utils/redirectUser";
const inter = Inter({ subsets: ["latin"] });

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

  const disneyVideos = await getVideos("disney Trailer");
  const popularVideos = await getPopularVideos();
  const standUpComedyVideos = await getVideos("standup comedy");
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const netflixSeries = await getVideos("Netflix series trailer");
  const musicVideos = await getVideos("Popular Song");

  return {
    props: {
      disneyVideos,
      netflixSeries,
      popularVideos,
      musicVideos,
      watchItAgainVideos,
      standUpComedyVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  netflixSeries,
  popularVideos,
  musicVideos,
  watchItAgainVideos,
  standUpComedyVideos,
}) {
  return (
    <>
      <Head>
        <title>Welcome to Netflix Clone</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <Navbar />
        <Banner
          videoId="Di310WS8zLk"
          title="Wednesday"
          subTitle="Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy."
          imgUrl="/static/wednesday.jpg"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="medium" />
          <SectionCards
            title="Watch it again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards
            title="Netflix Series"
            videos={netflixSeries}
            size="small"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
          <SectionCards
            title="Stand up comedy"
            videos={standUpComedyVideos}
            size="small"
          />

          <SectionCards title="Music" videos={musicVideos} size="small" />
        </div>
      </div>
    </>
  );
}
