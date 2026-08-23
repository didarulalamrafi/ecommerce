"use client";

import { useState } from "react";
import type { AuthUser } from "@/lib/auth-client";

interface ProfileTabProps {
  user: AuthUser;
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    number: user.number || "",
    address: user.address || "",
    bio: user.bio || "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setSaving(true);
    try {
      // ✅ FIX: relative path না দিয়ে Express সার্ভারের (NEXT_PUBLIC_APP_URL)
      // পুরো URL ব্যবহার করছি, নাহলে এটা Next.js সার্ভারকে (localhost:3000)
      // হিট করত এবং কখনোই আসল backend-এ পৌঁছাত না (404 দিত)।
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/user/profile`,
        {
          method: "PATCH",
          credentials: "include", // ✅ Session cookie পাঠানোর জন্য জরুরি (cross-origin)
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      if (res.ok) {
        setIsEditing(false);
        // ✅ আপডেট হওয়া ডেটা সাথে সাথে দেখানোর জন্য পেজ রিফ্রেশ করছি
        window.location.reload();
      } else {
        const errBody = await res.json().catch(() => null);
        alert(errBody?.error || "প্রোফাইল আপডেট ব্যর্থ হয়েছে");
      }
    } catch (err) {
      alert("ত্রুটি ঘটেছে");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#202A44]/10 p-6 dark:border-[#F6F1E9]/10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#202A44] dark:text-[#F6F1E9]">
          আপনার প্রোফাইল
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-lg bg-[#E2A227] px-4 py-2 text-sm text-white transition hover:opacity-90"
        >
          {isEditing ? "বাতিল" : "এডিট করুন"}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[#202A44]/70 dark:text-[#F6F1E9]/70">
            নাম
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-[#202A44] dark:bg-white/5 dark:text-[#F6F1E9]"
            />
          ) : (
            <p className="text-[#202A44] dark:text-[#F6F1E9]">{user.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-[#202A44]/70 dark:text-[#F6F1E9]/70">
            ইমেইল
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-[#202A44] dark:bg-white/5 dark:text-[#F6F1E9]"
            />
          ) : (
            <p className="text-[#202A44] dark:text-[#F6F1E9]">{user.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-[#202A44]/70 dark:text-[#F6F1E9]/70">
            ফোন নম্বর
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="number"
              value={form.number}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-[#202A44] dark:bg-white/5 dark:text-[#F6F1E9]"
            />
          ) : (
            <p className="text-[#202A44] dark:text-[#F6F1E9]">
              {user.number || "সংযুক্ত নেই"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-[#202A44]/70 dark:text-[#F6F1E9]/70">
            ঠিকানা
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-[#202A44] dark:bg-white/5 dark:text-[#F6F1E9]"
            />
          ) : (
            <p className="text-[#202A44] dark:text-[#F6F1E9]">
              {user.address || "সংযুক্ত নেই"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-[#202A44]/70 dark:text-[#F6F1E9]/70">
            বায়ো
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-[#202A44] dark:bg-white/5 dark:text-[#F6F1E9]"
              rows={3}
            />
          ) : (
            <p className="text-[#202A44] dark:text-[#F6F1E9]">
              {user.bio || "সংযুক্ত নেই"}
            </p>
          )}
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-[#202A44] py-2 text-[#F6F1E9] transition hover:opacity-90 disabled:opacity-50 dark:bg-[#F6F1E9] dark:text-[#202A44]"
          >
            {saving ? "সেভ হচ্ছে..." : "সেভ করুন"}
          </button>
        )}
      </div>
    </div>
  );
}
