"use client";

import { useRouter } from "next/navigation";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import FlashSaleHero from "@/components/FlashSaleHero";
import TodaysBestDeals from "@/components/Todaysbestdeals";
import FAQSection from "@/components/FAQSection";

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

/**
 * NOTE: আগে এখানে একটা আলাদা <header> ছিল (সার্চ বার, ক্যাটেগরি রেইল, কার্ট আইকন,
 * হ্যামবার্গার মেনু) — কিন্তু app-এর গ্লোবাল <Navbar /> কম্পোনেন্ট (layout-এ বসানো)
 * একই কাজ করে, তাই এখানে ডুপ্লিকেট রাখার দরকার নেই। সার্চ এখন শুধু Navbar-এ থাকবে
 * এবং সেখানেই কাজ করবে।
 */
export default function Home() {
  const router = useRouter();

  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} min-h-screen bg-[#F5F6F8] font-[family-name:var(--font-body)] text-[#14213D]`}
    >
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

      {/* ---------- PRODUCT GRID (dynamic — ব্যাকএন্ড থেকে ফেচ হয়) ---------- */}
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

      {/* <FAQSection /> */}
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
