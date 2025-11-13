"use client";
import { CircularProgress } from "@mui/material";
import Image from "next/image";

export default function BookPreview({ book, loadingBook, isTyping, bookID }: { book: any | null; loadingBook: boolean, isTyping: boolean, bookID: string }) {
    return (
        <div>
            {loadingBook ? (
                <div className="flex justify-center py-4">
                    <CircularProgress size={28} />
                </div>
            ) : book ? (
                <div className="mt-2 flex items-center gap-4 border rounded-lg p-3 bg-white">
                    {book.coverPicture ? (
                        <div className="relative w-16 h-20">
                            <Image
                                src={book.coverPicture}
                                alt={book.title}
                                fill={true}
                                className="rounded-md object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                            No Image
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{book.title}</p>
                        <p className="text-gray-600 text-xs mb-1">by {book.author || "Unknown"}</p>
                        <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                                book.availableAmount > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                            {book.availableAmount > 0 ? `${book.availableAmount} Available` : "Out of Stock"}
                        </span>
                    </div>
                </div>
            ) : isTyping ? (
                ""
            ) : (
                bookID && (
                    <div className="mt-2 text-sm text-red-500">
                        No book found with ID: <strong>{bookID}</strong>.
                    </div>
                )
            )}
        </div>
    );
}
