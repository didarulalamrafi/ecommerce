"use client";

/* ============================================================================
 *  MELA — নেভবার (একক ফাইল সংস্করণ)
 * ============================================================================
 *  থিম কনসেপ্ট: "মেলা" মানে বাংলার লোকজ বাজার/উৎসব।
 *    - লাইট মোড = "দিনের মেলা"  → উষ্ণ ক্রিম + টেরাকোটা রঙ
 *    - ডার্ক মোড = "রাতের মেলা" → গাঢ় নীল-কালো + মেরিগোল্ড আভা
 *
 *  মোবাইলে হ্যামবার্গার মেনুর বদলে একটা ভাসমান "বটম ডক" ব্যবহার হয়েছে।
 *  ডকের মাঝখানে উঁচু, জ্বলজ্বলে সার্চ বাটন — মেলার লণ্ঠনের মতো।
 *
 *  এই ফাইলে যা যা আছে (উপর থেকে নিচে, এই ক্রমেই পড়লে বোঝা সহজ হবে):
 *    ১. কনফিগ/ডেটা         → CATEGORIES লিস্ট
 *    ২. আইকনগুলো            → ছোট ছোট SVG কম্পোনেন্ট
 *    ৩. ছোট UI টুকরো         → Logo, Avatar, CountDot, ThemeButton, DockButton
 *    ৪. মূল Navbar কম্পোনেন্ট → স্টেট + ইভেন্ট হ্যান্ডলার + JSX
 *
 *  নোট: "About / Contact" লিংক এখন এই নেভবারে নেই — ওগুলো ফুটারে থাকবে।
 * ==========================================================================*/

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut, AuthUser } from "../lib/auth-client";
import { useCart } from "../context/CartContext";
import { getRedirectPath } from "../lib/redirect-by-role";

// className গুলো শর্ত সাপেক্ষে জোড়া দেওয়ার জন্য ছোট্ট হেল্পার
// (falsy ভ্যালু বাদ দিয়ে বাকিগুলো space দিয়ে জোড়া লাগায়)
const cx = (...classNames: (string | false | undefined)[]) =>
  classNames.filter(Boolean).join(" ");

/* ============================================================================
 * ১. কনফিগ / ডেটা
 * ==========================================================================*/

// প্রোডাক্ট ক্যাটাগরি লিস্ট — ডেস্কটপ ড্রপডাউন আর সার্চ ওভারলে, দুই জায়গাতেই
// ব্যবহার হয়। নতুন ক্যাটাগরি যোগ করতে চাইলে শুধু এখানেই যোগ করলেই হবে।
const CATEGORIES = [
  {
    label: "ইলেকট্রনিক সামগ্রী",
    href: "/products/electronics",
    swatch: "#6B7FD7",
  },
  { label: "খাদ্যপণ্য", href: "/products/food", swatch: "#D9713F" },
  { label: "গৃহসামগ্রী", href: "/products/home", swatch: "#3E8E6B" },
  { label: "প্রসাধনী সামগ্রী", href: "/products/cosmetics", swatch: "#C1548E" },
];

/* ============================================================================
 * ২. আইকনগুলো (কোনো external icon library ব্যবহার হয়নি, সব হাতে-লেখা SVG)
 * ==========================================================================*/

function SearchIcon({
  size = 20,
  strokeWidth = 2,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="19"
      height="19"
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

function HomeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function StallIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M3 9 4.5 4h15L21 9" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M5 9v10h14V9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={cx("transition-transform duration-200", open && "rotate-180")}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ============================================================================
 * ৩. ছোট ছোট UI টুকরো (reusable presentational কম্পোনেন্ট)
 * ==========================================================================*/

// লোগো — তিনটা ওভারল্যাপিং বৃত্ত = পাশাপাশি স্টল/লণ্ঠনের সারি
function LogoMark() {
  return (
    <span className="relative flex h-7 w-7 items-center justify-center">
      <span className="absolute h-4 w-4 rounded-full bg-[#B1502F] dark:bg-[#D9713F]" />
      <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-[#E8A23D]" />
      <span className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full bg-[#1B1E2A] dark:bg-[#F4EEE2]" />
    </span>
  );
}

// ইউজারের নামের প্রথম অক্ষর দিয়ে গোল অ্যাভাটার বানায়
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cx(
        "grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#E8A23D] to-[#B1502F] font-[family-name:var(--font-display)] text-white",
        size === "sm" ? "h-6 w-6 text-xs" : "h-7 w-7 text-sm",
      )}
    >
      {name?.trim()?.charAt(0)?.toUpperCase() || "?"}
    </span>
  );
}

// কার্ট আইকনের উপরে ছোট্ট সংখ্যার ব্যাজ (৯+ হলে "9+" দেখায়)
function CountDot({ count, small }: { count: number; small?: boolean }) {
  return (
    <span
      className={cx(
        "absolute grid place-items-center rounded-full bg-[#B1502F] font-[family-name:var(--font-mono)] text-white dark:bg-[#E8A23D] dark:text-[#14161F]",
        small
          ? "-right-1.5 -top-1.5 h-4 w-4 text-[9px]"
          : "-right-0.5 -top-0.5 h-4 w-4 text-[9px]",
      )}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

// লাইট/ডার্ক মোড টগল বাটন
function ThemeButton({
  isDark,
  onClick,
  className,
}: {
  isDark: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      aria-label={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
      onClick={onClick}
      className={cx(
        "rounded-full p-2.5 text-[#1B1E2A]/70 transition-colors hover:bg-[#1B1E2A]/5 dark:text-[#F4EEE2]/70 dark:hover:bg-white/10",
        className,
      )}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// মোবাইল বটম ডকের একেকটা বাটন।
// `href` দিলে <Link> হিসেবে রেন্ডার হবে (পেজ বদলানোর জন্য),
// `href` না দিয়ে `onClick` দিলে <button> হিসেবে রেন্ডার হবে (যেমন সার্চ খোলার জন্য)।
function DockButton({
  active,
  label,
  icon,
  href,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      {/* active থাকলে আইকনের পেছনে একটা হালকা হাইলাইট বৃত্ত দেখায় */}
      <span
        className={cx(
          "pointer-events-none absolute -top-1 h-8 w-8 rounded-full transition-all duration-300",
          active
            ? "scale-100 bg-[#E8A23D]/15 opacity-100"
            : "scale-75 bg-transparent opacity-0",
        )}
      />
      <span
        className={cx(
          "relative transition-colors",
          active
            ? "text-[#B1502F] dark:text-[#E8A23D]"
            : "text-[#1B1E2A]/55 dark:text-[#F4EEE2]/55",
        )}
      >
        {icon}
      </span>
      <span
        className={cx(
          "text-[10px] font-medium transition-colors",
          active
            ? "text-[#B1502F] dark:text-[#E8A23D]"
            : "text-[#1B1E2A]/45 dark:text-[#F4EEE2]/45",
        )}
      >
        {label}
      </span>
    </>
  );

  const wrapperClass = "relative flex flex-1 flex-col items-center gap-1 py-1";

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={wrapperClass}>
      {content}
    </button>
  );
}

/* ============================================================================
 * ৪. মূল Navbar কম্পোনেন্ট
 * ==========================================================================*/

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user as AuthUser | undefined;
  const { cartCount } = useCart();

  // ইউজারের role অনুযায়ী প্রোফাইল/ড্যাশবোর্ডের সঠিক পেজ বের করা হয়
  const profilePath = user
    ? getRedirectPath((user as any)?.role || "user")
    : "/dashboard";

  /* ---------------------------- স্টেট ---------------------------- */
  const [scrolled, setScrolled] = useState(false); // স্ক্রল করলে টপবারে হালকা shadow দেখানোর জন্য
  const [hideTopbar, setHideTopbar] = useState(false); // নিচে স্ক্রল করলে টপবার লুকানোর জন্য
  const [isDark, setIsDark] = useState(false); // ডার্ক মোড অন/অফ
  const [searchOpen, setSearchOpen] = useState(false); // ফুলস্ক্রিন সার্চ ওভারলে খোলা/বন্ধ
  const [search, setSearch] = useState(""); // সার্চ ইনপুটের ভ্যালু
  const [categoryOpen, setCategoryOpen] = useState(false); // ডেস্কটপ hover ক্যাটাগরি ড্রপডাউন

  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);

  /* ------------------- স্ক্রল করলে টপবার লুকানো/দেখানো ------------------- */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);

      const diff = y - lastScrollY.current;
      if (y < 80 || searchOpen) {
        // একদম উপরে থাকলে, বা সার্চ খোলা থাকলে — সবসময় টপবার দেখাও
        setHideTopbar(false);
      } else if (diff > 4) {
        // নিচের দিকে স্ক্রল করলে টপবার লুকাও
        setHideTopbar(true);
      } else if (diff < -4) {
        // উপরের দিকে স্ক্রল করলে টপবার আবার দেখাও
        setHideTopbar(false);
      }
      lastScrollY.current = y;
    };

    onScroll(); // প্রথমবার লোড হওয়ার সময়ও একবার চালানো হচ্ছে
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [searchOpen]);

  /* --------------- পেজ লোড হওয়ার সময় সেভ করা থিম প্রয়োগ করা --------------- */
  useEffect(() => {
    const saved = localStorage.getItem("maati-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const dark = saved ? saved === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  /* --------------- সার্চ ওভারলে খুললে ইনপুটে অটোফোকাস --------------- */
  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [searchOpen]);

  /* --------- সার্চ ওভারলে খোলা থাকলে পেছনের পেজ স্ক্রল বন্ধ রাখা --------- */
  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  /* ---------------------------- ফাংশনগুলো ---------------------------- */

  // থিম টগল করে + localStorage-এ সেভ করে রাখে (পরের ভিজিটেও মনে থাকবে)
  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("maati-theme", next ? "dark" : "light");
      return next;
    });
  }

  // সার্চ কোয়েরি নিয়ে /products পেজে নিয়ে যায়
  function runSearch(query: string) {
    const target = query.trim()
      ? `/products?q=${encodeURIComponent(query.trim())}`
      : "/products";
    setSearchOpen(false);
    router.push(target);

    // নোট: আগে এখানে router.refresh()ও কল হতো। App Router-এ router.push
    // দিয়ে শুধু query param বদলালে টার্গেট পেজ এমনিতেই নতুন searchParams
    // নিয়ে re-render হয়ে যায় — তাই আলাদা refresh() দরকার নেই, বরং সেটা
    // push-এর ঠিক পরপরই একটা এক্সট্রা রিফেচ/রেস কন্ডিশন তৈরি করে "loading"
    // আটকে থাকার একটা সম্ভাব্য কারণ হতে পারত।
    // যদি সার্চ এখনো "loading"-এ আটকে থাকে, তাহলে সমস্যাটা এখানে না — বরং
    // /products পেজের নিজের fetch/loading-state লজিকে (সেই useEffect বা
    // async ফাংশনের `finally` ব্লকে loading false করা হচ্ছে কিনা, চেক করবেন)।
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(search);
  }

  // বর্তমান URL দেখে বটম ডকের কোন ট্যাব "active" দেখানো হবে সেটা বের করা হয়
  // (এটা শুধু আনুমানিক — পিক্সেল-পারফেক্ট মিলের দরকার নেই)
  const activeTab: "home" | "stalls" | "profile" | null =
    pathname === "/"
      ? "home"
      : pathname?.startsWith("/products")
        ? "stalls"
        : pathname?.startsWith("/dashboard") || pathname === profilePath
          ? "profile"
          : null;

  /* ============================== JSX ============================== */
  return (
    <>
      {/* ==================== টপ বার (সব স্ক্রিন সাইজে দেখা যায়) ==================== */}
      <header
        className={cx(
          "sticky top-0 z-40 border-b transition-all duration-300",
          "border-[#1B1E2A]/8 bg-[#F6F1E7]/85 backdrop-blur-lg",
          "dark:border-[#F4EEE2]/8 dark:bg-[#14161F]/85",
          scrolled && "shadow-[0_6px_24px_-12px_rgba(20,22,31,0.35)]",
          hideTopbar ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cx(
            "mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 md:px-8",
            scrolled ? "py-2" : "py-3.5",
          )}
        >
          {/* --- লোগো (বাম পাশে, ক্লিক করলে হোমপেজে যায়) --- */}
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-[family-name:var(--font-display)] text-xl italic tracking-tight text-[#1B1E2A] dark:text-[#F4EEE2]">
              Mela
            </span>
          </Link>

          {/* --- ডেস্কটপ ন্যাভ: শুধু "স্টলগুলো" ড্রপডাউন (about/contact ফুটারে) --- */}
          <nav className="hidden items-center gap-8 text-[13.5px] font-medium md:flex">
            <div
              className="relative"
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => setCategoryOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 py-1 text-[#1B1E2A]/80 transition-colors hover:text-[#B1502F] dark:text-[#F4EEE2]/80 dark:hover:text-[#E8A23D]"
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((v) => !v)}
              >
                স্টলগুলো
                <ChevronIcon open={categoryOpen} />
              </button>

              {/* হোভার/ক্লিকে খোলা ড্রপডাউন প্যানেল */}
              <div
                className={cx(
                  "absolute left-1/2 top-full w-60 -translate-x-1/2 pt-3 transition-all duration-200",
                  categoryOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0",
                )}
              >
                <div className="overflow-hidden rounded-2xl border border-[#1B1E2A]/8 bg-white shadow-xl shadow-black/5 dark:border-[#F4EEE2]/10 dark:bg-[#1D2029]">
                  <div className="flex flex-col gap-0.5 p-2">
                    <Link
                      href="/products"
                      className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#1B1E2A] transition-colors hover:bg-[#1B1E2A]/[0.04] dark:text-[#F4EEE2] dark:hover:bg-white/5"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#1B1E2A] dark:bg-[#F4EEE2]" />
                      সব প্রোডাক্ট
                    </Link>
                    <div className="my-1 h-px bg-[#1B1E2A]/8 dark:bg-[#F4EEE2]/10" />
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="group flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 transition-colors hover:bg-[#1B1E2A]/[0.04] dark:hover:bg-white/5"
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full transition-transform group-hover:scale-125"
                          style={{ backgroundColor: c.swatch }}
                        />
                        <span className="text-[13px] leading-tight text-[#1B1E2A] dark:text-[#F4EEE2]">
                          {c.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* --- ডান পাশ: সার্চ, থিম টগল, কার্ট, লগইন/প্রোফাইল/লগআউট --- */}
          <div className="flex items-center gap-1">
            {/* এই ব্লকটা শুধু ডেস্কটপে দেখা যায় (মোবাইলে বটম ডক এসব সামলায়) */}
            <div className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="সার্চ করুন"
                className="rounded-full p-2.5 text-[#1B1E2A]/70 transition-colors hover:bg-[#1B1E2A]/5 dark:text-[#F4EEE2]/70 dark:hover:bg-white/10"
              >
                <SearchIcon />
              </button>

              <ThemeButton isDark={isDark} onClick={toggleTheme} />

              <Link
                href="/dashboard?tab=cart"
                className="relative rounded-full p-2.5 text-[#1B1E2A]/70 transition-colors hover:bg-[#1B1E2A]/5 dark:text-[#F4EEE2]/70 dark:hover:bg-white/10"
                aria-label="কার্ট"
              >
                <CartIcon />
                {cartCount > 0 && <CountDot count={cartCount} />}
              </Link>

              {/* সেশন লোড হওয়ার সময় স্কেলেটন, তারপর লগইন করা থাকলে প্রোফাইল, না থাকলে লগইন বাটন */}
              {isPending ? (
                <div className="ml-2 h-9 w-24 animate-pulse rounded-full bg-[#1B1E2A]/10 dark:bg-white/10" />
              ) : user ? (
                <Link
                  href={profilePath}
                  className="ml-2 flex items-center gap-2 rounded-full border border-[#1B1E2A]/12 py-1 pl-1 pr-3.5 transition-colors hover:border-[#E8A23D]/60 dark:border-[#F4EEE2]/15"
                >
                  <Avatar name={user.name} />
                  <span className="max-w-[8rem] truncate text-[13px] font-medium text-[#1B1E2A] dark:text-[#F4EEE2]">
                    {user.name}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 rounded-full bg-[#1B1E2A] px-5 py-2 text-[13px] font-medium text-[#F6F1E7] transition-opacity hover:opacity-90 dark:bg-[#E8A23D] dark:text-[#14161F]"
                >
                  লগইন
                </Link>
              )}

              {/* লগইন করা থাকলেই লগআউট আইকন বাটন দেখাবে */}
              {user && (
                <button
                  onClick={() => signOut({})}
                  className="ml-1 rounded-full p-2.5 text-[#1B1E2A]/50 transition-colors hover:bg-[#1B1E2A]/5 hover:text-[#B1502F] dark:text-[#F4EEE2]/50 dark:hover:bg-white/10 dark:hover:text-[#E8A23D]"
                  aria-label="লগআউট"
                  title="লগআউট"
                >
                  <LogoutIcon />
                </button>
              )}
            </div>

            {/* মোবাইলে শুধু থিম টগল বাটনটা টপবারে থাকে */}
            <ThemeButton
              isDark={isDark}
              onClick={toggleTheme}
              className="md:hidden"
            />
          </div>
        </div>
      </header>

      {/* ==================== মোবাইল বটম ডক (শুধু মোবাইলে দেখা যায়) ==================== */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="relative flex w-full items-center justify-between border-t border-[#1B1E2A]/8 bg-[#F6F1E7]/95 px-2 py-2 shadow-[0_-8px_30px_-8px_rgba(20,22,31,0.25)] backdrop-blur-xl dark:border-[#F4EEE2]/10 dark:bg-[#1D2029]/95">
          <DockButton
            active={activeTab === "home"}
            label="হোম"
            href="/"
            icon={<HomeIcon />}
          />

          {/* "স্টল" এখন সরাসরি /products পেজে নিয়ে যায় — সেই পেজের নিজস্ব
              ক্যাটাগরি-ফিল্টার (chips) দিয়েই প্রোডাক্ট ব্রাউজ করা যাবে,
              তাই এখানে আলাদা কোনো ভারী bottom-sheet/modal রাখা হয়নি */}
          <DockButton
            active={activeTab === "stalls"}
            label="স্টল"
            href="/products"
            icon={<StallIcon />}
          />

          {/* মাঝের উঁচু, জ্বলজ্বলে সার্চ বাটন — মেলার লণ্ঠনের মতো, এই ডিজাইনের সিগনেচার এলিমেন্ট */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="সার্চ করুন"
            className="relative -mt-8 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#F0B056] to-[#D9713F] text-white shadow-[0_8px_24px_-4px_rgba(217,113,63,0.65)] transition-transform active:scale-95"
          >
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#E8A23D] opacity-40 blur-lg" />
            <SearchIcon strokeWidth={2.3} size={20} />
          </button>

          <DockButton
            active={false}
            label="কার্ট"
            href="/dashboard?tab=cart"
            icon={
              <span className="relative">
                <CartIcon />
                {cartCount > 0 && <CountDot count={cartCount} small />}
              </span>
            }
          />

          <DockButton
            active={activeTab === "profile"}
            label={user ? "প্রোফাইল" : "লগইন"}
            href={user ? profilePath : "/login"}
            icon={user ? <Avatar name={user.name} size="sm" /> : <UserIcon />}
          />
        </div>
      </nav>

      {/* ==================== ফুলস্ক্রিন সার্চ ওভারলে (মোবাইল + ডেস্কটপ, দুই জায়গাতেই ব্যবহার হয়) ==================== */}
      <div
        className={cx(
          "fixed inset-0 z-50 transition-opacity duration-200",
          searchOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!searchOpen}
      >
        {/* ব্যাকগ্রাউন্ড ওভারলে — এখানে ক্লিক করলেও সার্চ বন্ধ হয়ে যায় */}
        <div
          onClick={() => setSearchOpen(false)}
          className="absolute inset-0 bg-[#14161F]/60 backdrop-blur-sm"
        />

        <div
          className={cx(
            "absolute inset-x-0 top-0 border-b border-[#1B1E2A]/10 bg-[#F6F1E7] px-5 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] transition-transform duration-300 dark:border-[#F4EEE2]/10 dark:bg-[#14161F]",
            searchOpen ? "translate-y-0" : "-translate-y-6",
          )}
        >
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-[family-name:var(--font-display)] text-lg italic text-[#1B1E2A] dark:text-[#F4EEE2]">
                কী খুঁজছেন?
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="বন্ধ করুন"
                className="rounded-full p-2 text-[#1B1E2A]/60 hover:bg-[#1B1E2A]/5 dark:text-[#F4EEE2]/60 dark:hover:bg-white/10"
              >
                <CloseIcon />
              </button>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-3"
            >
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#1B1E2A]/15 bg-white px-4 py-3.5 focus-within:border-[#E8A23D] dark:border-[#F4EEE2]/15 dark:bg-[#1D2029]">
                <SearchIcon size={18} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="প্রোডাক্ট, ব্র্যান্ড বা কারিগর খুঁজুন..."
                  className="w-full bg-transparent text-sm text-[#1B1E2A] outline-none placeholder:text-[#1B1E2A]/35 dark:text-[#F4EEE2] dark:placeholder:text-[#F4EEE2]/35"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-2xl bg-[#1B1E2A] px-5 py-3.5 text-sm font-medium text-[#F6F1E7] dark:bg-[#E8A23D] dark:text-[#14161F]"
              >
                খুঁজুন
              </button>
            </form>

            {/* কীবোর্ডে না লিখেই দ্রুত একটা ক্যাটাগরি সিলেক্ট করার শর্টকাট চিপস */}
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.href}
                  type="button"
                  onClick={() => runSearch(c.label)}
                  className="rounded-full border border-[#1B1E2A]/10 px-3.5 py-1.5 text-xs text-[#1B1E2A]/70 transition-colors hover:border-[#E8A23D]/60 hover:text-[#B1502F] dark:border-[#F4EEE2]/15 dark:text-[#F4EEE2]/70 dark:hover:text-[#E8A23D]"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* মোবাইল বটম ডকের নিচে কন্টেন্ট ঢাকা পড়ে না যায়, তাই লেআউটের <main>-এ
          "mb-24 md:mb-0" ক্লাস দিয়ে দিও (mobile-এ ৬rem জায়গা রাখা হবে) */}
    </>
  );
}
