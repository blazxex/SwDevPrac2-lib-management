"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react"
import Image from "next/image";
import { BookItem } from "../../interface";
import getBooks from "@/libs/getBooks";

export default function PromoteCard() {
  const {data:session} = useSession()

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    getBooks().then((res) => {
      if (isMounted) {
        setBooks(res.data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredBooks = books.slice(0, 5);
  const totalBooks = featuredBooks.length;

  useEffect(() => {
    if (featuredBooks.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredBooks.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [featuredBooks.length]);

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Library Management System
            </h1>
            <p className="text-xl max-w-lg">
              Browse and reserve your books efficiently.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/books" className="inline-flex">
              <span className="bg-gray-900 hover:bg-gray-800 px-8 py-4 rounded-lg font-medium 
                              text-lg transition-all transform hover:scale-105 text-white flex items-center justify-center shadow-md">
                Browse Books
              </span>
            </Link>

            {session ? (
                <Link href="/reserve" className="inline-flex">
                  <span className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-lg font-medium 
                                  text-lg transition-all transform hover:scale-105 text-white flex items-center justify-center shadow-md">
                    Reserve Books
                  </span>
                </Link>
                  ) : (
                <Link href="/api/auth/signin" className="inline-flex">
                  <span className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-lg font-medium 
                                  text-lg transition-all transform hover:scale-105 text-white flex items-center justify-center shadow-md">
                    Sign In to Reserve Books
                  </span>
                </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">{totalBooks}</div>
              <div className="mt-1 text-sm sm:text-base">Books</div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-green-600">Up to 3</div>
              <div className="mt-1 text-sm sm:text-base">Reservation per Person</div>
            </div>
          </div>
        </div>

        {/* Right Side - Book Carousel */}
        <div className="relative">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-gray-900 text-2xl font-bold mb-6 text-center">
              Featured Books
            </h3>

            {!loading ? (
              <>
                {/* Carousel Container */}
                <div className="relative h-96 overflow-hidden rounded-lg">
                  <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {featuredBooks.map((book) => (
                      <div
                        key={book.id}
                        className="w-full flex-shrink-0 flex items-center justify-center"
                      >
                        <Link
                          href={`/books/${book.id}`}
                          className="text-center group cursor-pointer block"
                        >
                          <div className="relative w-52 h-72 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <Image
                              src={book.coverPicture}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          </div>
                          <h4 className="text-gray-900 font-semibold text-lg truncate max-w-52 group-hover:text-gray-700 transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-gray-600 group-hover:text-gray-500 transition-colors">
                            by {book.author}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                book.availableAmount > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {book.availableAmount > 0
                                ? `${book.availableAmount} available`
                                : "Out of stock"}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() =>
                    setCurrentSlide(
                      (prev) =>
                        (prev - 1 + featuredBooks.length) % featuredBooks.length
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
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
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % featuredBooks.length)
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-6 gap-2">
                  {featuredBooks.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${
                        currentSlide === index
                          ? "bg-gray-900"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <div className="text-gray-600">Loading books...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
