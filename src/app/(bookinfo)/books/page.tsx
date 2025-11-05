import BookCatalog from "@/components/BookCatalog";
import getBooks from "@/libs/getBooks";

export default function Books() {
  const books = getBooks();
  return (
    <main>
      <h1 className="text-xl text-center font-medium p-5">Select your book</h1>
      <BookCatalog booksJson={books} />
    </main>
  );
}
