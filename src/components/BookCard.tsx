"use client";
import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { Rating } from "@mui/material";
import { BookItem } from "../../interface";

interface BookCardProps {
  bookItem: BookItem;
  bookName: string;
  imgSrc: string;
  onRating?: Function;
  isAdmin: boolean;
  onEdit?: (book: BookItem) => void;
  onDelete?: (bookId: string) => void;
}

export default function BookCard({
  bookItem,
  bookName,
  imgSrc,
  onRating,
  isAdmin,
  onEdit,
  onDelete,
}: BookCardProps) {
  const testid = bookName + " Rating";

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(bookItem);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      onDelete &&
      confirm(`Are you sure you want to delete "${bookItem.title}"?`)
    ) {
      onDelete(bookItem.id);
    }
  };

  return (
    <InteractiveCard>
      <div className="w-full h-64 relative rounded-t-lg overflow-hidden">
        <Image
          src={imgSrc}
          alt={bookName}
          fill={true}
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer"
              title="Edit book"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer"
              title="Delete book"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-gray-900 text-lg font-bold mb-2 line-clamp-2 leading-tight">
          {bookName}
        </h3>
        {bookItem && (
          <div className="space-y-1 mb-3">
            <p className="text-gray-600 text-md font-bold">{bookItem.title}</p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Author:</span> {bookItem.author}
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  bookItem.availableAmount > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {bookItem.availableAmount > 0 ? "In Stock" : "Out of Stock"}
              </span>
              {bookItem.availableAmount > 0 && (
                <span className="text-gray-600 text-xs">
                  {bookItem.availableAmount} available
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {onRating && (
        <div className="p-4 pt-0">
          <Rating
            id={testid}
            name={testid}
            data-testid={testid}
            defaultValue={0}
            precision={0.5}
            className="text-yellow-500"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(e, value) => {
              onRating(bookName, value ?? 0);
            }}
          />
        </div>
      )}
    </InteractiveCard>
  );
}
