"use client";

import { useState } from "react";

/**
 * Contact page — Maati
 *
 * Design plan
 * - Palette/type: reuses the site tokens (bg #F6F1E9 / #171A24, ink #202A44,
 *   terracotta #B1502F, turmeric #E2A227, Fraunces display, IBM Plex Mono).
 * - Signature element: a "seal" — concentric rings around a stamped Bangla
 *   letter, like a wheel-thrown pot's ripples pressed into clay. Reused at
 *   the hero and on the map, each time rotated a little differently, so it
 *   reads as hand-stamped rather than a repeated icon.
 * - Structure: hero -> ledger-style contact details (each row = a labeled
 *   line, like a studio order slip) beside the form -> map framed like a
 *   postcard.
 */

const cx = (...c: (string | false | undefined)[]) =>
  c.filter(Boolean).join(" ");

const CONTACT_INFO = [
  { label: "ঠিকানা", value: "৪৭ শিল্পকলা সরণি, ধানমন্ডি, ঢাকা ১২০৯" },
  { label: "ফোন", value: "+৮৮০ ১৭১২-৩৪৫৬৭৮" },
  { label: "ইমেইল", value: "hello@maati.com" },
  { label: "স্টুডিও সময়", value: "শনি – বৃহস্পতি, সকাল ১০টা – সন্ধ্যা ৭টা" },
];

const SUBJECTS = [
  "সাধারণ প্রশ্ন",
  "কাস্টম অর্ডার",
  "পাইকারি / হোলসেল",
  "অন্যান্য",
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21v-7.5H16l.5-3.5h-3V7.7c0-1 .3-1.7 1.8-1.7H16.5V2.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3.5h2.5V21h4Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const inputClass =
  "w-full rounded-xl border border-[#202A44]/15 bg-white/50 px-4 py-3 text-[#202A44] outline-none transition-colors placeholder:text-[#202A44]/40 focus:border-[#B1502F] focus:ring-2 focus:ring-[#B1502F]/20 dark:border-[#F6F1E9]/15 dark:bg-white/5 dark:text-[#F6F1E9] dark:placeholder:text-[#F6F1E9]/40 dark:focus:border-[#E2A227] dark:focus:ring-[#E2A227]/20";

const labelClass =
  "font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#202A44]/50 dark:text-[#F6F1E9]/50";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const update =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire to your real endpoint (API route / email service)
    setTimeout(() => setStatus("sent"), 900);
  };

  return (
    <main className="min-h-screen bg-[#F6F1E9] dark:bg-[#171A24]">
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 pb-16 pt-16 md:px-8 md:pb-20 md:pt-24">
        <Seal className="absolute right-4 top-6 h-20 w-20 rotate-[8deg] motion-safe:animate-[maati-wobble_7s_ease-in-out_infinite] md:right-10 md:top-10 md:h-28 md:w-28" />

        <p className={cx(labelClass, "text-[#B1502F] dark:text-[#E2A227]")}>
          যোগাযোগ
        </p>

        <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-tight text-[#202A44] dark:text-[#F6F1E9] md:text-6xl">
          চলুন, কথা বলি
        </h1>

        <p className="mt-5 max-w-md text-[#202A44]/70 dark:text-[#F6F1E9]/70 md:text-lg">
          প্রশ্ন থাকুক বা কাস্টম অর্ডারের ভাবনা — নিচে লিখুন, অথবা সরাসরি
          স্টুডিওতে যোগাযোগ করুন। প্রতিটা বার্তার উত্তর আমরা নিজেরাই দিই।
        </p>
      </section>

      {/* Info + form */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
        <div className="grid gap-12 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
          {/* Ledger-style info */}
          <div className="border-t border-[#202A44]/15 dark:border-[#F6F1E9]/15">
            {CONTACT_INFO.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 border-b border-[#202A44]/15 py-5 dark:border-[#F6F1E9]/15"
              >
                <span className={labelClass}>{item.label}</span>
                <span className="text-[#202A44] dark:text-[#F6F1E9]">
                  {item.value}
                </span>
              </div>
            ))}

            <div className="flex gap-3 pt-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#202A44]/20 text-[#202A44] transition-colors hover:border-[#B1502F] hover:text-[#B1502F] dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9] dark:hover:border-[#E2A227] dark:hover:text-[#E2A227]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={cx(labelClass, "mb-2 block")}>
                  নাম
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="আপনার নাম"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className={cx(labelClass, "mb-2 block")}>
                  ইমেইল
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className={cx(labelClass, "mb-2 block")}>
                বিষয়
              </label>
              <select
                id="subject"
                value={form.subject}
                onChange={update("subject")}
                className={inputClass}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className={cx(labelClass, "mb-2 block")}>
                বার্তা
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={update("message")}
                placeholder="যা বলতে চান, লিখুন..."
                className={cx(inputClass, "resize-none")}
              />
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className="inline-flex items-center gap-2 rounded-full bg-[#B1502F] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#963f22] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#E2A227] dark:text-[#171A24] dark:hover:bg-[#c98d1f]"
            >
              {status === "sending"
                ? "পাঠানো হচ্ছে..."
                : status === "sent"
                  ? "পাঠানো হয়েছে ✓"
                  : "পাঠিয়ে দিন"}
            </button>
          </form>
        </div>
      </section>

      {/* Map, framed like a postcard */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#202A44]/10 dark:border-[#F6F1E9]/10">
          <iframe
            title="স্টুডিওর অবস্থান"
            src="https://www.google.com/maps?q=Dhanmondi,Dhaka&output=embed"
            loading="lazy"
            className="h-[320px] w-full grayscale-[15%] contrast-[1.05] md:h-[400px]"
          />
          <Seal className="absolute left-5 top-5 h-14 w-14 -rotate-6 md:left-8 md:top-8 md:h-16 md:w-16" />
        </div>
      </section>

      <style jsx global>{`
        @keyframes maati-wobble {
          0%,
          100% {
            transform: rotate(8deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
      `}</style>
    </main>
  );
}

/** Seal — pottery-wheel rings stamped with a maker's mark. The page's signature element. */
function Seal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-[#B1502F]/25 dark:text-[#E2A227]/25"
      />

      <circle
        cx="50"
        cy="50"
        r="25"
        className="fill-[#B1502F] dark:fill-[#E2A227]"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="24"
        className="fill-[#F6F1E9] dark:fill-[#171A24]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ম
      </text>
    </svg>
  );
}
