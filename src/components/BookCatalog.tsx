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

export default function BookCatalog({
  initialBooks,
}: BookCatalogProps) {
  const { data: session } = useSession();
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedBook, setSelectedBook] = useState<BookItem | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

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

  const handleAddBook = () => {
    setModalMode("add");
    setSelectedBook(undefined);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: BookItem) => {
    setModalMode("edit");
    setSelectedBook(book);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((bookItem: BookItem) => (
          <Link
            href={`/books/${bookItem.id}`}
            key={bookItem.id}
            className="transform transition-transform hover:scale-105 focus:scale-105 focus:outline-none"
          >
            <BookCard
              bookItem={bookItem}
              venueName={bookItem.title}
              imgSrc={bookItem.coverPicture}
              isAdmin={isAdmin}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          </Link>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found.</p>
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