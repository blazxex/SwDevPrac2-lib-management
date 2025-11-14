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
        className="relative flex items-center justify-center h-[50px] px-3 min-w-[140px] text-black font-bold font-sans 
                   transition-all duration-300 rounded group hover:bg-gray-200"
      >
        <span className="mr-1 relative">
          {userName}
        </span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform ${
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
        <span
          className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all 
                      duration-300 group-hover:w-full group-hover:opacity-100 opacity-0"
        ></span>
      </button>

      <div
        className={`absolute right-0 top-full mt-2 mr-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50
                    transform transition-all duration-200 origin-top
                    ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}`}
      >
        <Link
          href="/profile"
          onClick={() => setIsOpen(false)}
          className="relative flex items-center px-4 py-3 hover:bg-gray-100 transition-all duration-300"
        >
          <span className="relative text-sm text-black">
            Profile
          </span>
        </Link>

        <hr className="border-gray-200" />

        <Link
          href="/api/auth/signout"
          onClick={() => setIsOpen(false)}
          className="relative flex items-center px-4 py-3 hover:bg-red-50 transition-all duration-300"
        >
          <span className="relative text-sm text-red-600">
            Sign Out
          </span>
        </Link>
      </div>
    </div>
  );
}
