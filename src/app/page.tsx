import styles from "./page.module.css";
import Banner from "@/components/Banner";
import PromoteCard from "@/components/PromoteCard";
import getBooks from "@/libs/getBooks";

export default async function Home() {
  const booksData = await getBooks();

  return (
    <main className={styles.main}>
      {/* <Banner/> */}
      <PromoteCard books={booksData.data} />
    </main>
  );
}
