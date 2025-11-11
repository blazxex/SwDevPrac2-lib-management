"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BookCard from "./BookCard";
import BookModal from "./BookModal";
import { BookItem, BookJson } from "../../interface";
import { createBook, updateBook, deleteBook } from "@/libs/adminOperations";
import getUserProfile from "@/libs/getUserProfile";

interface BookCatalogProps {
  initialBooks: BookItem[];
}

export default function BookCatalog({ initialBooks }: BookCatalogProps) {
  const { data: session } = useSession();
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [filteredBooks, setFilteredBooks] = useState<BookItem[]>(initialBooks);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedBook, setSelectedBook] = useState<BookItem | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<
    "all" | "title" | "author" | "publisher"
  >("all");
  const [sortBy, setSortBy] = useState<
    "title" | "author" | "newest" | "oldest"
  >("title");

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.token) {
        try {
          const profile = await getUserProfile(session.user.token);
          setIsAdmin(profile.data?.role === "admin");
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  useEffect(() => {
    let filtered = [...books];

    if (searchTerm.trim()) {
      filtered = filtered.filter((book) => {
        const searchLower = searchTerm.toLowerCase();

        if (filterBy === "all") {
          return (
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower) ||
            book.publisher.toLowerCase().includes(searchLower) ||
            book.ISBN.toLowerCase().includes(searchLower)
          );
        } else if (filterBy === "title") {
          return book.title.toLowerCase().includes(searchLower);
        } else if (filterBy === "author") {
          return book.author.toLowerCase().includes(searchLower);
        } else if (filterBy === "publisher") {
          return book.publisher.toLowerCase().includes(searchLower);
        }

        return true;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  }, [books, searchTerm, filterBy, sortBy]);

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  const handleAddBook = () => {
    setModalMode("add");
    setSelectedBook(undefined);
    setIsModalOpen(true);
  };


  const handleDeleteBook = async (bookId: string) => {
    if (!session?.user?.token) return;

    setLoading(true);
    try {
      await deleteBook(bookId, session.user.token);
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBook = async (bookData: any) => {
    if (!session?.user?.token) return;

    try {
      if (modalMode === "add") {
        const response = await createBook(bookData, session.user.token);
        setBooks([...books, response.data]);
      } else if (selectedBook) {
        const response = await updateBook(
          selectedBook.id,
          bookData,
          session.user.token
        );
        setBooks(
          books.map((book) =>
            book.id === selectedBook.id ? response.data : book
          )
        );
      }
    } catch (error) {
      console.error("Error submitting book:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isAdmin && (
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Book Management</h2>
          <button
            onClick={handleAddBook}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 hover:cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Book
          </button>
        </div>
      )}

      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <select
              value={filterBy}
              onChange={(e) =>
                setFilterBy(
                  e.target.value as "all" | "title" | "author" | "publisher"
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            >
              <option value="all">Search in: All Fields</option>
              <option value="title">Search in: Title</option>
              <option value="author">Search in: Author</option>
              <option value="publisher">Search in: Publisher</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "title" | "author" | "newest" | "oldest"
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            >
              <option value="title">Sort by: Title (A-Z)</option>
              <option value="author">Sort by: Author (A-Z)</option>
              <option value="newest">Sort by: Newest First</option>
              <option value="oldest">Sort by: Oldest First</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {filteredBooks.length} of {books.length} books
            {searchTerm && (
              <span className="ml-2">
                for "
                <span className="font-medium text-gray-900">{searchTerm}</span>"
              </span>
            )}
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.map((bookItem: BookItem) => (
          <Link
            href={`/books/${bookItem.id}`}
            key={bookItem.id}
            className="transform transition-transform hover:scale-105 focus:scale-105 focus:outline-none"
          >
            <BookCard
              bookItem={bookItem}
              bookName={bookItem.title}
              imgSrc={bookItem.coverPicture}
              isAdmin={isAdmin}
              onDelete={handleDeleteBook}
            />
          </Link>
        ))}
      </div>

      {filteredBooks.length === 0 && books.length > 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.632M15 6.306A7.962 7.962 0 0112 5c-2.34 0-4.29 1.007-5.824 2.632M12 9a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">
            No books match your search criteria
          </p>
          <p className="text-gray-400 text-sm">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {books.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books available.</p>
        </div>
      )}

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitBook}
        book={selectedBook}
        mode={modalMode}
      />
    </div>
  );
}
