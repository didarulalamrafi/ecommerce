"use client";

import Image from "next/image";
import { useState } from "react";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

/**
 * Fonts
 * - Fraunces: warm, slightly irregular serif -> echoes hand-thrown pottery
 * - Inter: body copy
 * - IBM Plex Mono: prices / SKU-style labels
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const CATEGORIES = [
  {
    name: "মাটির পাত্র",
    en: "Terracotta Pots",
    img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "সিরামিক টেবিলওয়্যার",
    en: "Ceramic Tableware",
    img: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "ফুলদানি ও ডেকর",
    en: "Vases & Decor",
    img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "চা ও কফি সেট",
    en: "Tea & Coffee Sets",
    img: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=800&auto=format&fit=crop",
  },
];

const PRODUCTS = [
  {
    name: "রাজশাহী টেরাকোটা ফুলদানি",
    artisan: "শিল্পী: মোঃ করিম, রাজশাহী",
    price: "১,২৫০",
    img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800&auto=format&fit=crop",
    tag: "নতুন",
  },
  {
    name: "হাতে আঁকা সিরামিক বাটি সেট",
    artisan: "শিল্পী: রিনা বেগম, পাবনা",
    price: "১,৮৯০",
    img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop",
    tag: "বেস্টসেলার",
  },
  {
    name: "নীল-সাদা চায়ের কাপ (৪ পিস)",
    artisan: "শিল্পী: আব্দুল জব্বার, কুমিল্লা",
    price: "৯৫০",
    img: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=800&auto=format&fit=crop",
    tag: null,
  },
  {
    name: "মাটির প্ল্যান্টার — মাঝারি",
    artisan: "শিল্পী: সালমা খাতুন, পাবনা",
    price: "৭৫০",
    img: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?q=80&w=800&auto=format&fit=crop",
    tag: null,
  },
];

const PROCESS_STEPS = [
  {
    step: "০১",
    title: "মাটি সংগ্রহ",
    desc: "পদ্মা তীরের এঁটেল মাটি বাছাই করে আনা হয়।",
  },
  {
    step: "০২",
    title: "চাকায় গড়া",
    desc: "কারিগরের হাতে চাকায় ফর্ম দেওয়া হয়।",
  },
  {
    step: "০৩",
    title: "রোদে শুকানো",
    desc: "প্রাকৃতিক রোদে কয়েক দিন শুকানো হয়।",
  },
  {
    step: "০৪",
    title: "চুল্লিতে পোড়ানো",
    desc: "ঐতিহ্যবাহী চুল্লিতে পুড়িয়ে মজবুত করা হয়।",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} min-h-screen bg-[#F6F1E9] font-[family-name:var(--font-body)] text-[#202A44]`}
    >
      {/* ---------- HERO ---------- */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="mb-6 inline-block rounded-full border border-[#5B6B4C]/30 bg-[#5B6B4C]/10 px-3 py-1 text-sm text-[#5B6B4C]">
              হাতে তৈরি · সীমিত সংখ্যক
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight md:text-6xl">
              মাটির গল্প,{" "}
              <span className="italic text-[#B1502F]">প্রতিটি ঘরে।</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#202A44]/70">
              বাংলাদেশের কারিগরদের হাতে গড়া টেরাকোটা ও সিরামিক পণ্য — প্রতিটি
              পিস আলাদা, প্রতিটির পেছনে আছে একজন শিল্পীর গল্প।
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-[#B1502F] px-8 py-3 text-base text-white transition-colors hover:bg-[#9c4327]">
                কেনাকাটা শুরু করুন
              </button>
              <button className="rounded-full border border-[#202A44] px-8 py-3 text-base text-[#202A44] transition-colors hover:bg-[#202A44] hover:text-[#F6F1E9]">
                আমাদের গল্প পড়ুন
              </button>
            </div>

            <div className="mt-10 flex gap-8 text-sm">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-2xl">
                  ৪০+
                </p>
                <p className="text-[#202A44]/60">অংশীদার কারিগর</p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-mono)] text-2xl">
                  ৫০০+
                </p>
                <p className="text-[#202A44]/60">হাতে তৈরি ডিজাইন</p>
              </div>
            </div>
          </div>

          {/* offset image collage + signature seal */}
          <div className="relative mx-auto grid max-w-md grid-cols-2 gap-4">
            <div className="relative mt-10 h-56 overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800&auto=format&fit=crop"
                alt="হাতে তৈরি ফুলদানি"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-72 overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop"
                alt="মাটির পাত্র"
                fill
                className="object-cover"
              />
            </div>

            {/* signature handmade seal */}
            <div className="absolute -left-6 top-1/2 grid h-24 w-24 -translate-y-1/2 rotate-[-12deg] place-items-center rounded-full border-2 border-dashed border-[#E2A227] bg-[#F6F1E9] text-center shadow-lg">
              <span className="font-[family-name:var(--font-display)] text-xs italic leading-tight text-[#B1502F]">
                হাতে
                <br />
                তৈরি
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRUST STRIP ---------- */}
      <section className="border-y border-[#202A44]/10 bg-[#FFFDF8]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 text-center text-sm md:grid-cols-4 md:px-8">
          <TrustItem icon={<TruckIcon />} label="সারাদেশে ডেলিভারি" />
          <TrustItem icon={<ShieldIcon />} label="নিরাপদ পেমেন্ট" />
          <TrustItem icon={<PackageIcon />} label="সেফ প্যাকেজিং" />
          <TrustItem icon={<HeartIcon />} label="কারিগরকে সরাসরি সাপোর্ট" />
        </div>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section id="categories" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
            ক্যাটাগরি অনুযায়ী দেখুন
          </h2>
          <a
            href="#products"
            className="hidden text-sm text-[#B1502F] hover:underline md:block"
          >
            সব দেখুন →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <a
              key={c.en}
              href="#products"
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#202A44]/70 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-[family-name:var(--font-display)] text-lg">
                  {c.name}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-xs opacity-80">
                  {c.en}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- FEATURED PRODUCTS ---------- */}
      <section id="products" className="bg-[#FFFDF8] py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
              এই সপ্তাহের বাছাই
            </h2>
            <a
              href="#"
              className="hidden text-sm text-[#B1502F] hover:underline md:block"
            >
              সব প্রোডাক্ট →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="group rounded-2xl border border-[#202A44]/10 bg-[#F6F1E9] p-3 transition-shadow hover:shadow-lg"
              >
                <div className="relative mb-3 h-40 overflow-hidden rounded-xl md:h-48">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#E2A227] px-2 py-0.5 text-[11px] font-medium text-[#202A44]">
                      {p.tag}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium leading-snug">{p.name}</p>
                <p className="mt-1 text-xs text-[#202A44]/50">{p.artisan}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-[family-name:var(--font-mono)] text-sm">
                    ৳{p.price}
                  </span>
                  <button
                    aria-label="কার্টে যোগ করুন"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#202A44] text-[#F6F1E9] transition-colors hover:bg-[#B1502F]"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PROCESS (real sequence -> numbering justified) ---------- */}
      <section id="story" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative h-80 overflow-hidden rounded-[2rem] md:h-[28rem]">
            <Image
              src="https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?q=80&w=1000&auto=format&fit=crop"
              alt="কারিগর কাজ করছেন"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[#5B6B4C]">
              আমাদের প্রক্রিয়া
            </p>
            <h2 className="mb-8 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
              মাটি থেকে যেভাবে ঘরে আসে
            </h2>
            <div className="space-y-6">
              {PROCESS_STEPS.map((s) => (
                <div key={s.step} className="flex gap-4">
                  <span className="font-[family-name:var(--font-mono)] text-sm text-[#B1502F]">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm text-[#202A44]/60">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[#B1502F]">{icon}</span>
      <span className="text-[#202A44]/70">{label}</span>
    </div>
  );
}

/* ---------- inline icons (no extra deps) ---------- */

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="1.5" />
      <circle cx="18.5" cy="18.5" r="1.5" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
