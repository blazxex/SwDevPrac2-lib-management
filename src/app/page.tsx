import Banner from "@/components/Banner";
import PromoteCard from "@/components/PromoteCard";
import getBooks from "@/libs/getBooks";

export default async function Home() {
  const booksData = await getBooks();

  return (
    <main className="overflow-hidden" style={{ height: 'calc(100vh - 50px)' }}>
      <PromoteCard books={booksData.data} />
    </main>
  );
}
