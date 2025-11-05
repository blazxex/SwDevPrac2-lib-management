import Card from "./Card";
import Link from "next/link";
import { BookItem, BookJson } from "../../interface";

export default async function BookCatalog({
  booksJson,
}: {
  booksJson: Promise<BookJson>;
}) {
  const booksJsonReady = await booksJson;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {booksJsonReady.data.map((bookItem: BookItem) => (
          <Link
            href={`/books/${bookItem.id}`}
            key={bookItem.id}
            className="transform transition-transform hover:scale-105 focus:scale-105 focus:outline-none"
          >
            <Card
              bookItem={bookItem}
              venueName={bookItem.title}
              imgSrc={bookItem.coverPicture}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
