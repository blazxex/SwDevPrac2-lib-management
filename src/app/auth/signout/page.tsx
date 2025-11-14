"use client";

import { signOut } from "next-auth/react";

export default function SignOutPage() {
  return (
    <main className="overflow-hidden min-h-[calc(100vh-50px)] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg min-w-96 w-1/4 shadow-lg text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Are you sure you want to sign out?
        </h1>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
          >
            <span className="font-medium text-white">
              Sign Out
            </span>
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <span className="font-medium text-white">
              Cancel
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
