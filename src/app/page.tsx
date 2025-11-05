import styles from "./page.module.css";
import Banner from "@/components/Banner"
import PromoteCard from "@/components/PromoteCard";

export default function Home() {
  return (
    <main className={styles.main}>
      <Banner/>
      <PromoteCard/>
    </main>
  );
}
