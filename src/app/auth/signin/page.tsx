"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect  } from "react";
import { TextField, Alert } from "@mui/material";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setMessage("Sign up successful! You can now sign in.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/",
    });

    if (res?.error) {
      setMessage("Invalid credentials");
    }
    setLoading(false);
  }

  return (
    <main className="overflow-hidden min-h-[calc(100vh-50px)] flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg min-w-96 w-1/4 space-y-6 gap-5 flex flex-col"
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center">Sign In</h1>

        {message && (
          <Alert severity={message.includes("successful") ? "success" : "error"}>
            {message}
          </Alert>
        )}

        <TextField type="email" label="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          required fullWidth
        />
        <TextField type="password" label="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          required fullWidth
        />

        <button
          type="submit" disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      
        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/auth/signup">
            <span className="text-blue-600 hover:underline">Sign Up</span>
          </Link>
        </div>
      </form>
    </main>
  );
}
