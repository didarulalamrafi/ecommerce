"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = isRegister
        ? await authClient.signUp.email({
            name: form.name,
            email: form.email,
            password: form.password,
          })
        : await authClient.signIn.email({
            email: form.email,
            password: form.password,
          });

      if (authError) {
        throw new Error(authError.message || "কিছু একটা সমস্যা হয়েছে");
      }

      router.push("/dashboard");
      router.refresh(); // Navbar-এর লগইন স্টেট রিফ্রেশ করার জন্য
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "facebook") {
    await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto my-12 p-8 rounded-2xl border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-semibold text-center mb-6">
        {isRegister ? "একাউন্ট তৈরি করুন" : "লগইন করুন"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="পূর্ণ নাম"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="ইমেইল"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          name="password"
          placeholder="পাসওয়ার্ড"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-black text-white font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "একটু অপেক্ষা করুন..." : isRegister ? "সাইন আপ" : "লগইন"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">অথবা</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleOAuth("google")}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          <GoogleIcon />
          Google দিয়ে চালিয়ে যান
        </button>

        <button
          onClick={() => handleOAuth("facebook")}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          <FacebookIcon />
          Facebook দিয়ে চালিয়ে যান
        </button>
      </div>

      <p className="text-sm text-center text-gray-500 mt-6">
        {isRegister ? (
          <>
            আগে থেকেই একাউন্ট আছে?{" "}
            <a href="/login" className="text-black font-medium underline">
              লগইন করুন
            </a>
          </>
        ) : (
          <>
            একাউন্ট নেই?{" "}
            <a href="/register" className="text-black font-medium underline">
              সাইন আপ করুন
            </a>
          </>
        )}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.9-2.26c-.81.54-1.85.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.69A5.4 5.4 0 013.68 9c0-.59.1-1.16.27-1.69V4.98H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.02l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.98l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#1877F2"
        d="M18 9a9 9 0 10-10.4 8.9v-6.3H5.3V9h2.3V7.1c0-2.3 1.4-3.6 3.5-3.6.99 0 2.03.18 2.03.18v2.24h-1.14c-1.13 0-1.48.7-1.48 1.42V9h2.52l-.4 2.6h-2.12v6.3A9 9 0 0018 9z"
      />
    </svg>
  );
}
