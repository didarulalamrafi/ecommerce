"use client";

import { useState, FormEvent } from "react";
import { authClient } from "../../lib/auth-client";

// Better Auth এর session থেকে user টাইপ বের করা হচ্ছে
type AuthUser = (typeof authClient.$Infer.Session)["user"];

interface ProfileTabProps {
  user: AuthUser | null | undefined;
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const [form, setForm] = useState({
    name: user?.name || "",
    number: (user as any)?.number || "",
    address: (user as any)?.address || "",
    bio: (user as any)?.bio || "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // user এখনো না এলে (সেশন লোড হচ্ছে বা লগইন করা নেই) — ফর্ম রেন্ডার না করে
  // একটা সেফ ফলব্যাক দেখানো হচ্ছে, যাতে user.name পড়তে গিয়ে ক্র্যাশ না করে।
  if (!user) {
    return (
      <div className="rounded-2xl border border-[#202A44]/10 p-6 dark:border-[#F6F1E9]/10">
        <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
          লোড হচ্ছে...
        </p>
      </div>
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // লগইন কুকি পাঠানোর জন্য জরুরি
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("প্রোফাইল সফলভাবে আপডেট হয়েছে");
      setEditing(false);
    } catch {
      setMessage("প্রোফাইল আপডেট করা যায়নি, আবার চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-4 py-2.5 text-sm text-[#202A44] outline-none transition focus:border-[#E2A227] focus:ring-2 focus:ring-[#E2A227]/30 disabled:opacity-60 dark:border-[#F6F1E9]/15 dark:bg-white/5 dark:text-[#F6F1E9]";

  return (
    <div className="rounded-2xl border border-[#202A44]/10 p-6 dark:border-[#F6F1E9]/10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
          প্রোফাইল তথ্য
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="rounded-full border border-[#202A44] px-4 py-1.5 text-sm text-[#202A44] transition-colors hover:bg-[#202A44] hover:text-[#F6F1E9] dark:border-[#F6F1E9] dark:text-[#F6F1E9] dark:hover:bg-[#F6F1E9] dark:hover:text-[#202A44]"
          >
            এডিট করুন
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Field label="নাম">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            className={fieldClass}
          />
        </Field>

        {/* ইমেইল বদলানো যাবে না — শুধু দেখানো হচ্ছে */}
        <Field label="ইমেইল">
          <input value={user.email} disabled className={fieldClass} />
        </Field>

        <Field label="মোবাইল নম্বর">
          <input
            name="number"
            value={form.number}
            onChange={handleChange}
            disabled={!editing}
            className={fieldClass}
          />
        </Field>

        <Field label="ঠিকানা">
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={!editing}
            placeholder="আপনার ঠিকানা লিখুন"
            className={fieldClass}
          />
        </Field>

        <Field label="বায়ো / সম্পর্কে">
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            disabled={!editing}
            rows={3}
            placeholder="নিজের সম্পর্কে কিছু লিখুন"
            className={fieldClass}
          />
        </Field>

        {message && (
          <p className="text-sm text-[#B1502F] dark:text-[#E2A227]">
            {message}
          </p>
        )}

        {editing && (
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#202A44] px-6 py-2 text-sm text-[#F6F1E9] transition hover:opacity-90 disabled:opacity-50 dark:bg-[#F6F1E9] dark:text-[#202A44]"
            >
              {saving ? "সেভ হচ্ছে..." : "সেভ করুন"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-[#202A44]/20 px-6 py-2 text-sm text-[#202A44] transition hover:bg-[#202A44]/5 dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9]"
            >
              বাতিল
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        {label}
      </label>
      {children}
    </div>
  );
}
