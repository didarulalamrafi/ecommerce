"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { useCart } from "../context/CartContext";
import FlashSaleHero from "@/components/FlashSaleHero";
import TodaysBestDeals from "@/components/Todaysbestdeals";

/**
 * Fonts
 * - Space Grotesk: technical, energetic display face -> fits a multi-vendor marketplace
 * - Inter: body copy
 * - IBM Plex Mono: prices, stall numbers, countdown digits
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

interface Category {
  name: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { name: "ইলেকট্রনিক্স", icon: "📱" },
  { name: "ফ্যাশন", icon: "👗" },
  { name: "হোম ও লিভিং", icon: "🛋️" },
  { name: "বিউটি", icon: "💄" },
  { name: "মুদি", icon: "🛒" },
  { name: "খেলনা", icon: "🧸" },
  { name: "স্পোর্টস", icon: "⚽" },
  { name: "বই", icon: "📚" },
];

export default function Home() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [search, setSearch] = useState("");
  // মোবাইলে হ্যামবার্গার মেনু খোলা/বন্ধ আছে কিনা — এখানে "বিক্রেতা হন" আর "লগইন" লিংক থাকবে
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      search ? `/products?q=${encodeURIComponent(search)}` : "/products",
    );
  }

  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} min-h-screen bg-[#F5F6F8] font-[family-name:var(--font-body)] text-[#14213D]`}
    >
      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-30 border-b border-[#14213D]/10 bg-[#F5F6F8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 md:px-8">
          {/* ডেস্কটপ সার্চ বার — মোবাইলে হাইড, নিচে আলাদা মোবাইল সার্চ ফর্ম আছে */}
          <form
            onSubmit={handleSearch}
            className="relative hidden flex-1 md:block"
          >
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="প্রোডাক্ট, ব্র্যান্ড বা বিক্রেতা খুঁজুন"
              className="w-full rounded-full border border-[#14213D]/15 bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#14213D]/40 focus:border-[#FF5A1F]"
            />
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-3 text-sm sm:gap-5">
            {/* এই দুইটা লিংক আগে শুধু md:block ছিল, তাই মোবাইলে এক্সেসই করা যেত না।
                এখন হ্যামবার্গার মেনুর ভেতরে মোবাইলে দেখাবে (নিচে দেখো)। */}
            <Link
              href="/seller"
              className="hidden text-[#14213D]/70 hover:text-[#FF5A1F] md:block"
            >
              বিক্রেতা হন
            </Link>
            <Link
              href="/login"
              className="hidden text-[#14213D]/70 hover:text-[#FF5A1F] md:block"
            >
              লগইন
            </Link>
            <Link href="/cart" className="relative">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#FF5A1F] font-[family-name:var(--font-mono)] text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* হ্যামবার্গার মেনু বাটন — শুধু মোবাইলে দেখাবে (md:hidden) */}
            <button
              type="button"
              aria-label="মেনু খুলুন"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="grid h-8 w-8 place-items-center text-[#14213D] md:hidden"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* মোবাইল ড্রপডাউন মেনু — বিক্রেতা হন / লগইন, শুধু menuOpen true হলে দেখাবে */}
        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-[#14213D]/10 bg-white px-4 py-2 md:hidden">
            <Link
              href="/seller"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm text-[#14213D]/80 hover:bg-[#F5F6F8]"
            >
              বিক্রেতা হন
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm text-[#14213D]/80 hover:bg-[#F5F6F8]"
            >
              লগইন
            </Link>
          </div>
        )}

        {/* মোবাইল সার্চ ফর্ম — শুধু মোবাইলে দেখাবে */}
        <form
          onSubmit={handleSearch}
          className="relative px-4 pb-3 sm:px-5 md:hidden"
        >
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="প্রোডাক্ট খুঁজুন"
            className="w-full rounded-full border border-[#14213D]/15 bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#14213D]/40 focus:border-[#FF5A1F]"
          />
        </form>

        {/* ক্যাটেগরি রেইল — হরাইজন্টাল স্ক্রল, মোবাইলে পিল সাইজ একটু ছোট */}
        <div className="scrollbar-none flex gap-2 overflow-x-auto border-t border-[#14213D]/5 px-4 py-3 sm:gap-3 sm:px-5 md:px-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href="/products"
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#14213D]/10 bg-white px-3 py-1.5 text-xs text-[#14213D]/70 transition-colors hover:border-[#FF5A1F] hover:text-[#FF5A1F] sm:gap-2 sm:px-3.5 sm:text-sm"
            >
              <span>{c.icon}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </header>

      {/* ---------- FLASH SALE HERO ---------- */}
      <FlashSaleHero />

      {/* ---------- TRUST STRIP ---------- */}
      <section className="border-y border-[#14213D]/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-6 text-center text-sm md:grid-cols-4 md:px-8">
          <TrustItem icon={<TruckIcon />} label="সারাদেশে ডেলিভারি" />
          <TrustItem icon={<ShieldIcon />} label="যাচাইকৃত বিক্রেতা" />
          <TrustItem icon={<PackageIcon />} label="সহজ রিটার্ন" />
          <TrustItem icon={<CashIcon />} label="ক্যাশ অন ডেলিভারি" />
        </div>
      </section>

      {/* ---------- TOP SELLERS (stalls) ---------- */}
      {/* কমেন্ট করা আছে — চাইলে পরে আবার চালু করতে পারো */}

      {/* ---------- PRODUCT GRID (এখন dynamic — ব্যাকএন্ড থেকে ফেচ হয়) ---------- */}
      <TodaysBestDeals />

      {/* ---------- SELL ON মেলা CTA ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#14213D] p-10 text-white md:flex-row md:items-center md:p-14">
          <div>
            <p className="mb-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[#FFC93C]">
              বিক্রেতাদের জন্য
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
              আপনার নিজের স্টল খুলুন মেলায়
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/60">
              হাজারো ক্রেতার কাছে সরাসরি পৌঁছান — নিবন্ধন করুন কয়েক মিনিটে।
            </p>
          </div>
          <button
            onClick={() => router.push("/seller")}
            className="shrink-0 rounded-full bg-[#FF5A1F] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e64f18]"
          >
            বিক্রেতা হিসেবে শুরু করুন
          </button>
        </div>
      </section>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[#FF5A1F]">{icon}</span>
      <span className="text-[#14213D]/70">{label}</span>
    </div>
  );
}

/* ---------- inline icons (no extra deps) ---------- */

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#14213D]/40"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
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
function CashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}
