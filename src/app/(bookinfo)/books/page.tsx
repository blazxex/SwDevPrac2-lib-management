import BookCatalog from "@/components/BookCatalog";
import getBooks from "@/libs/getBooks";

export default async function Books() {
  const booksData = await getBooks();
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Library
          </h1>
          <p className="text-gray-600">Browse and select your favorite books</p>
        </div>
        <BookCatalog initialBooks={booksData.data} />
      </div>
    </main>
  );
}
