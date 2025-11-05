"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface UserProfileDropdownProps {
  userName: string;
}

export default function UserProfileDropdown({
  userName,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-full px-3 text-yellow-900 font-bold font-sans hover:bg-gray-200 transition-colors rounded"
      >
        <span className="mr-1">{userName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <hr className="my-1 border-gray-200" />
          <Link
            href="/api/auth/signout"
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Sign Out
          </Link>
        </div>
      )}
    </div>
  );
}
