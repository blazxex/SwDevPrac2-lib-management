"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, MenuItem, Select, InputLabel, FormControl, Alert } from "@mui/material";
import Link from "next/link";
import userRegister from "@/libs/userRegister";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await userRegister(name, email, tel, role, password);
      router.push("/auth/signin?registered=true");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
      setSeverity("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="overflow-hidden min-h-[calc(100vh-50px)] flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg min-w-96 w-1/4 space-y-6 gap-5 flex flex-col"
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center">Sign Up</h1>

        {message ? <Alert severity={severity}>{message}</Alert>
          :""}

        <TextField label="Name" value={name}
          onChange={(e) => setName(e.target.value)}
          required fullWidth
        />
        <TextField type="email" label="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          required fullWidth
        />
        <TextField type="tel"  label="Phone" value={tel}
          onChange={(e) => setTel(e.target.value)}
          required fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="role-label">Role</InputLabel>
          <Select labelId="role-label" value={role} label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <TextField type="password" label="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          required fullWidth
        />
        
        <button
          type="submit" disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/signin">
            <span className="text-blue-600 hover:underline">Sign In</span>
          </Link>
        </div>
      </form>
    </main>
  );
}
