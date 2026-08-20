"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Electronics banner images shown in the rotating carousel on the right.
 * These are placeholder Unsplash URLs — swap them with your own product
 * photos when ready (see the comment at the bottom of this file for the
 * recommended way to add images).
 */
const BANNER_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    alt: "ল্যাপটপ ও গ্যাজেট",
    title: "ল্যাপটপে সর্বোচ্চ ৩৫% ছাড়",
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    alt: "হেডফোন",
    title: "প্রিমিয়াম হেডফোন কালেকশন",
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    alt: "স্মার্ট ওয়াচ",
    title: "নতুন স্মার্ট ওয়াচ সিরিজ",
  },
  {
    src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop",
    alt: "ক্যামেরা",
    title: "ক্যামেরায় স্পেশাল অফার",
  },
];

interface CountdownParts {
  h: number;
  m: number;
  s: number;
}

function getCountdownParts(target: number): CountdownParts {
  const diff = Math.max(0, target - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s };
}

export default function FlashSaleHero() {
  const router = useRouter();

  // ফ্ল্যাশ সেল কাউন্টডাউন — আজ রাত ১২টা পর্যন্ত টাইমার চলবে
  const [endOfDay] = useState<number>(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  });
  const [time, setTime] = useState<CountdownParts>(() =>
    getCountdownParts(endOfDay),
  );

  useEffect(() => {
    // প্রতি সেকেন্ডে কাউন্টডাউন আপডেট হবে
    const id = setInterval(() => setTime(getCountdownParts(endOfDay)), 1000);
    return () => clearInterval(id);
  }, [endOfDay]);

  // ডান পাশের ব্যানার ইমেজ — কোনটা এখন দেখা যাচ্ছে তার ইনডেক্স
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // প্রতি ৪ সেকেন্ডে অটোমেটিক পরের ইমেজে চলে যাবে (এক এক করে ঘুরবে)
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
      {/*
        NOTE: এখানে grid এর বদলে flex ইউজ করা হয়েছে ইচ্ছে করেই।
        কারণ: নিচের বাম পাশের অফার বক্সটা যদি কমেন্ট করে দাও (disable করে দাও),
        তাহলে ডান পাশের ব্যানার (flex-1 দেওয়া আছে) automatically পুরো width/space
        নিয়ে নিবে — কোনো className পাল্টাতে হবে না।
      */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* ========== বাম পাশ: ফ্ল্যাশ সেল প্রোমো বক্স ==========
            👉 পুরো এই ব্লকটা (নিচের <div> থেকে তার closing </div> পর্যন্ত)
               কমেন্ট করে দিলে ডান পাশের ব্যানার একাই পুরো জায়গা নিয়ে নিবে।
        */}
        <div className="relative overflow-hidden rounded-3xl bg-[#14213D] p-8 text-white md:w-[62%] md:p-12">
          <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[#FFC93C]">
            আজকের মেলা · সীমিত সময়
          </p>
          <h1 className="max-w-md font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] md:text-5xl">
            হাজারো বিক্রেতা, <span className="text-[#FF5A1F]">একটাই মেলা।</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            সারাদেশের যাচাইকৃত বিক্রেতাদের কাছ থেকে সরাসরি কিনুন — আজকের ফ্ল্যাশ
            সেলে ৪৫% পর্যন্ত ছাড়।
          </p>

          {/* কাউন্টডাউন টাইমার — ঘণ্টা : মিনিট : সেকেন্ড */}
          <div className="mt-6 flex items-center gap-2">
            <CountBox label="ঘণ্টা" value={pad(time.h)} />
            <span className="pb-4 text-xl text-white/40">:</span>
            <CountBox label="মিনিট" value={pad(time.m)} />
            <span className="pb-4 text-xl text-white/40">:</span>
            <CountBox label="সেকেন্ড" value={pad(time.s)} />
          </div>

          <button
            onClick={() => router.push("/products")}
            className="mt-8 rounded-full bg-[#FF5A1F] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e64f18]"
          >
            ডিলগুলো দেখুন
          </button>
        </div>
        {/* ========== বাম পাশ শেষ ========== */}

        {/* ========== ডান পাশ: অটো-চেঞ্জিং ইলেকট্রনিক্স ব্যানার (ছবি একটার পর একটা আসবে) ==========
            flex-1 থাকার কারণে বাম পাশ কমেন্ট করে দিলে এটা নিজে থেকেই ফুল স্পেস নিয়ে নিবে।
        */}
        <div className="relative h-[220px] w-full flex-1 overflow-hidden rounded-3xl sm:h-[280px] md:h-auto md:min-h-[26rem]">
          {BANNER_IMAGES.map((banner, index) => (
            <div
              key={banner.src}
              // যেটা active সেটাই দেখা যাবে, বাকিগুলো ফেড-আউট করে লুকানো থাকবে
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority={index === 0} // প্রথম ইমেজটা আগে লোড হবে (LCP এর জন্য ভালো)
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/80 via-transparent to-transparent" />
              {/*
                right-16 রাখা হয়েছে যাতে টেক্সট ডান পাশের ডট ইন্ডিকেটরের সাথে
                ওভারল্যাপ না করে। line-clamp-2 দিয়ে দুই লাইনের বেশি হলে কেটে দিবে।
              */}
              <div className="absolute bottom-3 left-3 right-16 text-white sm:bottom-4 sm:left-4">
                <p className="line-clamp-2 font-[family-name:var(--font-display)] text-sm font-semibold leading-snug sm:text-lg">
                  {banner.title}
                </p>
              </div>
            </div>
          ))}

          {/* নিচে ডট ইন্ডিকেটর — কোন ইমেজে আছে সেটা দেখাবে, ক্লিক করেও চেঞ্জ করা যাবে */}
          <div className="absolute bottom-3 right-3 z-10 flex gap-1 sm:bottom-4 sm:right-4 sm:gap-1.5">
            {BANNER_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`ব্যানার ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-4 bg-white sm:w-5"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="rounded-lg bg-white/10 px-3 py-1.5 font-[family-name:var(--font-mono)] text-xl font-semibold">
        {value}
      </span>
      <span className="mt-1 text-[10px] text-white/40">{label}</span>
    </div>
  );
}

/**
 * HOW TO ADD YOUR OWN IMAGES — two options:
 *
 * 1) Local images (recommended for production):
 *    - Put your files inside the `public/images/` folder, e.g. public/images/banner-1.jpg
 *    - Reference them with a root-relative path: src="/images/banner-1.jpg"
 *    - Faster load, no dependency on an external server, works offline.
 *
 * 2) Remote/external images (fine for prototyping, like the Unsplash URLs above):
 *    - Add the image host to next.config.js under images.remotePatterns, e.g.:
 *      module.exports = { images: { remotePatterns: [{ hostname: "images.unsplash.com" }] } }
 *    - Without this, next/image will throw an error for external hosts.
 */
