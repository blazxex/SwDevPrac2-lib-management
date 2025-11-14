"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import getBook from "@/libs/getBook";
import getUserProfile from "@/libs/getUserProfile";
import { updateBook } from "@/libs/adminOperations";
import { BookItem } from "../../../../../interface";
import Link from "next/link";
import ImageModal from "../../../../components/ImageModal";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [book, setBook] = useState<BookItem | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    ISBN: "",
    publisher: "",
    availableAmount: 1,
    coverPicture: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { id } = await params;
        const bookDetail = await getBook(id);
        const bookData: BookItem = bookDetail.data;
        setBook(bookData);
        setFormData({
          title: bookData.title,
          author: bookData.author,
          ISBN: bookData.ISBN,
          publisher: bookData.publisher,
          availableAmount: bookData.availableAmount,
          coverPicture: bookData.coverPicture,
        });

        if (session?.user?.token) {
          try {
            const profile = await getUserProfile(session.user.token);
            const adminStatus = profile.data?.role === "admin";
            setIsAdmin(adminStatus);

            const editMode = searchParams.get("edit") === "true";
            if (editMode && adminStatus) {
              setIsEditing(true);
            }
          } catch (error) {
            console.error("Error checking admin status:", error);
          }
        }
      } catch (error) {
        console.error("Error loading book:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params, session, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "availableAmount" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    if (!session?.user?.token || !book) return;

    setSaving(true);
    try {
      await updateBook(book.id, formData, session.user.token);
      setBook({ ...book, ...formData });
      setIsEditing(false);
      alert("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        publisher: book.publisher,
        availableAmount: book.availableAmount,
        coverPicture: book.coverPicture,
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <Link href="/books" className="text-blue-600 hover:text-blue-800">
            Return to Catalog
          </Link>
        </div>
      </main>
    );
  }

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
                src={isEditing ? formData.coverPicture : book.coverPicture}
                alt={isEditing ? formData.title : book.title}
                className="relative h-full w-full"
              />
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                {isAdmin && (
                  <div className="mb-4 flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit Book
                      </button>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Author *
                        </label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                        {book.title}
                      </h1>
                      <p className="text-xl text-gray-600 mb-2">
                        by{" "}
                        <span className="font-semibold text-gray-800">
                          {book.author}
                        </span>
                      </p>
                    </>
                  )}
                </div>

                <div className="mb-8">
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Amount *
                      </label>
                      <input
                        type="number"
                        name="availableAmount"
                        value={formData.availableAmount}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          book.availableAmount > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.availableAmount > 0
                          ? "Available"
                          : "Out of Stock"}
                      </span>
                      {book.availableAmount > 0 && (
                        <span className="text-gray-600">
                          {book.availableAmount}{" "}
                          {book.availableAmount === 1 ? "book" : "books"}{" "}
                          available
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Book Details
                    </h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Publisher *
                          </label>
                          <input
                            type="text"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ISBN *
                          </label>
                          <input
                            type="text"
                            name="ISBN"
                            value={formData.ISBN}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cover Picture URL
                          </label>
                          <input
                            type="url"
                            name="coverPicture"
                            value={formData.coverPicture}
                            onChange={handleInputChange}
                            placeholder="https://example.com/cover.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!isEditing && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
