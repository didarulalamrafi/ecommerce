"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { getRedirectPath } from "../lib/redirect-by-role";

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
      // ✅ Sign up অথবা sign in করি
      const result = isRegister
        ? await authClient.signUp.email({
            name: form.name,
            email: form.email,
            password: form.password,
          })
        : await authClient.signIn.email({
            email: form.email,
            password: form.password,
          });

      // ✅ Error check করি
      if (result.error) {
        throw new Error(result.error.message || "কিছু একটা সমস্যা হয়েছে");
      }

      // ✅ FIX: getSession() না করে, সরাসরি HTTP endpoint থেকে fetch করি
      // Better Auth getSession() method arguments দাবি করে, তাই এটি skip করছি
      let userRole = "user"; // Default role

      try {
        // ✅ Session API endpoint থেকে role পাই
        const sessionResponse = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include", // ✅ Cookies include করি
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          // ✅ Response থেকে role extract করি (type safe casting সহ)
          userRole = (sessionData?.user as any)?.role || "user";
        }
      } catch (fetchErr) {
        // ✅ Fallback: default "user" role ব্যবহার করি
        console.warn("Session fetch failed, using default role:", fetchErr);
        userRole = "user";
      }

      // ✅ Role নিয়ে সঠিক page-এ redirect করি
      const redirectPath = getRedirectPath(userRole);
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "facebook") {
    // OAuth flow সরাসরি redirect করে বলে এখানে role পাওয়া যায় না
    // তাই callback একটা neutral page-এ যাবে, সেখান থেকে role দেখে আবার redirect হবে
    await authClient.signIn.social({
      provider,
      callbackURL: "/auth/redirect",
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
          Google দিয়ে চালিয়ে যান
        </button>

        <button
          onClick={() => handleOAuth("facebook")}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
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
