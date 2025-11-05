"use client";
import { useState, useEffect } from "react";
import { BookItem } from "../../interface";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookData: any) => Promise<void>;
  book?: BookItem;
  mode: "add" | "edit";
}

export default function BookModal({
  isOpen,
  onClose,
  onSubmit,
  book,
  mode,
}: BookModalProps) {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    ISBN: book?.ISBN || "",
    publisher: book?.publisher || "",
    availableAmount: book?.availableAmount || 1,
    coverPicture: book?.coverPicture || "",
  });
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    if (book && mode === "edit") {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        ISBN: book.ISBN || "",
        publisher: book.publisher || "",
        availableAmount: book.availableAmount || 1,
        coverPicture: book.coverPicture || "",
      });
    } else if (mode === "add") {
      setFormData({
        title: "",
        author: "",
        ISBN: "",
        publisher: "",
        availableAmount: 1,
        coverPicture: "",
      });
    }
  }, [book, mode]);

  useEffect(() => {
    setImageError(false);
  }, [formData.coverPicture]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "availableAmount" ? parseInt(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "add" ? "Add New Book" : "Edit Book"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-700">Preview</div>
              <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {formData.coverPicture &&
                formData.coverPicture.trim() !== "" &&
                !imageError ? (
                  <img
                    src={formData.coverPicture}
                    alt="Book cover preview"
                    className="w-full h-full object-contain"
                    onError={() => {
                      console.log(
                        "Image failed to load:",
                        formData.coverPicture
                      );
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg
                      className="w-16 h-16 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm">No image URL provided</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Form */}
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onChange={handleChange}
                    required
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
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher *
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Amount *
                  </label>
                  <input
                    type="number"
                    name="availableAmount"
                    value={formData.availableAmount}
                    onChange={handleChange}
                    min="0"
                    required
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
                    onChange={handleChange}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading
                      ? "Saving..."
                      : mode === "add"
                      ? "Add Book"
                      : "Update Book"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
