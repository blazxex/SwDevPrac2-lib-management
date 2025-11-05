import getBook from "@/libs/getBook";
import Image from "next/image";
import { BookItem } from "../../../../../interface";
import Link from "next/link";
import ImageModal from "../../../../components/ImageModal";
export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookDetail = await getBook(id);
  const book: BookItem = bookDetail.data;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4 hover:text-gray-800">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Catalog
            </Link>
          </nav>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative h-96 lg:h-full min-h-[500px] bg-gray-100">
              <ImageModal
                src={book.coverPicture}
                alt={book.title}
                className="relative h-full w-full"
              />
            </div>

            {/* Book Information Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                {/* Title and Author */}
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">
                    by{" "}
                    <span className="font-semibold text-gray-800">
                      {book.author}
                    </span>
                  </p>
                </div>

                {/* Availability Status */}
                <div className="mb-8">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        book.availableAmount > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.availableAmount > 0 ? "Available" : "Out of Stock"}
                    </span>
                    {book.availableAmount > 0 && (
                      <span className="text-gray-600">
                        {book.availableAmount}{" "}
                        {book.availableAmount === 1 ? "book" : "books"}{" "}
                        available
                      </span>
                    )}
                  </div>
                </div>

                {/* Book Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Book Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          Publisher
                        </p>
                        <p className="text-gray-900">{book.publisher}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          ISBN
                        </p>
                        <p className="text-gray-900 font-mono text-sm">
                          {book.ISBN}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg my-2">
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        Book ID
                      </p>
                      <p className="text-gray-900 font-mono text-sm">
                        {book.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 text-white">
                  {book.availableAmount > 0 ? (
                    <Link
                      href={`/reserve?bookId=${book.id}`}
                      className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 text-center"
                    >
                      Reserve Book
                    </Link>
                  ) : (
                    <div className="flex-1 px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed text-center">
                      Unavailable
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// export async function generateStaticParams() {
//   return [{vid:"001"},{vid:"002"},{vid:"003"}]
// }
