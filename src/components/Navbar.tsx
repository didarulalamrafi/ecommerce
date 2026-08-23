"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut, AuthUser } from "../lib/auth-client";
import { useCart } from "../context/CartContext";
import { getRedirectPath } from "../lib/redirect-by-role";

const cx = (...c: (string | false | undefined)[]) =>
  c.filter(Boolean).join(" ");

const styles = {
  link: "relative py-1 text-[#202A44] transition-colors hover:text-[#B1502F] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#B1502F] after:transition-all hover:after:w-full dark:text-[#F6F1E9] dark:hover:text-[#E2A227] dark:after:bg-[#E2A227]",
  panel:
    "overflow-hidden rounded-2xl border border-[#202A44]/10 bg-[#F6F1E9] shadow-lg dark:border-[#F6F1E9]/10 dark:bg-[#202A44]",
  panelItem:
    "block px-4 py-2.5 text-sm text-[#202A44] transition-colors hover:bg-[#E2A227]/15 hover:text-[#B1502F] dark:text-[#F6F1E9] dark:hover:bg-[#E2A227]/10 dark:hover:text-[#E2A227]",
  iconBtn:
    "rounded-full p-2.5 text-[#202A44] transition-colors hover:bg-[#202A44]/5 dark:text-[#F6F1E9] dark:hover:bg-white/10",
  input:
    "h-10 rounded-full border border-[#202A44]/15 bg-white/60 font-[family-name:var(--font-mono)] text-sm text-[#202A44] outline-none transition-all duration-300 placeholder:text-[#202A44]/40 focus:border-[#E2A227] focus:ring-2 focus:ring-[#E2A227]/30 dark:border-[#F6F1E9]/15 dark:bg-white/5 dark:text-[#F6F1E9] dark:placeholder:text-[#F6F1E9]/40",
};

const NAV_LINKS = [
  { label: "আমাদের গল্প", href: "/about" },
  { label: "যোগাযোগ", href: "/contact" },
];

const CATEGORIES = [
  { label: "ইলেকট্রনিক সামগ্রী", href: "/products/electronics" },
  { label: "খাদ্যপণ্য", href: "/products/food" },
  { label: "গৃহসামগ্রী", href: "products" },
  { label: "প্রসাধনী সামগ্রী", href: "/products/cosmetics" },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const { cartCount } = useCart();

  const profilePath = user
    ? getRedirectPath((user as any)?.role || "user")
    : "/dashboard";

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("maati-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const dark = saved ? saved === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("maati-theme", next ? "dark" : "light");
      return next;
    });
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      search.trim()
        ? `/products?q=${encodeURIComponent(search.trim())}`
        : "/products",
    );
    setOpen(false);
  }

  function handleDesktopSearchIconClick() {
    if (!searchOpen) {
      setSearchOpen(true);
      return;
    }
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b border-[#202A44]/10 bg-[#F6F1E9]/80 backdrop-blur-md transition-shadow duration-300 dark:border-[#F6F1E9]/10 dark:bg-[#171A24]/80",
        scrolled && "shadow-[0_4px_20px_-8px_rgba(32,42,68,0.25)]",
      )}
    >
      <div
        className={cx(
          "mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 md:px-8",
          scrolled ? "py-0.5" : "py-1",
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[#202A44] dark:text-[#F6F1E9]">
            Mela
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <div
            className="relative"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <Link href={"/products"}>
              <button
                className={cx(
                  "flex items-center gap-1 py-1",
                  styles.link,
                  "after:hidden",
                )}
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((v) => !v)}
              >
                প্রোডাক্ট
                <ChevronIcon open={categoryOpen} />
              </button>
            </Link>
            <Dropdown open={categoryOpen} align="center">
              {CATEGORIES.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className={cx(
                    styles.panelItem,
                    "border-b border-[#202A44]/5 last:border-b-0 dark:border-[#F6F1E9]/5",
                  )}
                >
                  {c.label}
                </a>
              ))}
            </Dropdown>
          </div>

          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="খুঁজুন..."
              className={cx(
                styles.input,
                searchOpen ? "w-48 px-4 opacity-100" : "w-0 px-0 opacity-0",
              )}
            />
            <button
              type="button"
              aria-label="সার্চ করুন"
              onClick={handleDesktopSearchIconClick}
              className={styles.iconBtn}
            >
              <SearchIcon />
            </button>
          </form>

          <button
            aria-label={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            onClick={toggleTheme}
            className={styles.iconBtn}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link href="/dashboard?tab=cart">
            <CartButton
              count={cartCount}
              className={cx("relative", styles.iconBtn)}
            />
          </Link>

          {isPending ? (
            <div className="ml-2 h-9 w-24 animate-pulse rounded-full bg-[#202A44]/10 dark:bg-white/10" />
          ) : user ? (
            <Link
              href={profilePath}
              className="ml-2 flex items-center gap-2 rounded-full border border-[#202A44]/15 py-1 pl-1 pr-3 transition-colors hover:bg-[#202A44]/5 dark:border-[#F6F1E9]/15 dark:hover:bg-white/10"
            >
              <Avatar name={user.name} />
              <span className="max-w-[8rem] truncate text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                {user.name}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-full border border-[#202A44] px-6 py-2 text-sm text-[#202A44] transition-colors hover:bg-[#202A44] hover:text-[#F6F1E9] dark:border-[#F6F1E9] dark:text-[#F6F1E9] dark:hover:bg-[#F6F1E9] dark:hover:text-[#202A44]"
            >
              লগইন
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            aria-label={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            onClick={toggleTheme}
            className="rounded-full p-2 text-[#202A44] dark:text-[#F6F1E9]"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="p-2 text-[#202A44] dark:text-[#F6F1E9]"
            aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <div
        className={cx(
          "overflow-hidden border-t border-[#202A44]/10 transition-[max-height] duration-300 dark:border-[#F6F1E9]/10 md:hidden",
          open ? "max-h-[34rem]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-5 text-sm font-medium">
          {user ? (
            <Link
              href={profilePath}
              onClick={() => setOpen(false)}
              className="mb-3 flex items-center gap-3 rounded-xl border border-[#202A44]/10 p-3 dark:border-[#F6F1E9]/10"
            >
              <Avatar name={user.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                  {user.name}
                </p>
                <p className="truncate font-[family-name:var(--font-mono)] text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                  {user.email}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mb-3 rounded-full border border-[#202A44] px-6 py-2.5 text-center text-sm text-[#202A44] dark:border-[#F6F1E9] dark:text-[#F6F1E9]"
            >
              লগইন
            </Link>
          )}

          <form
            onSubmit={handleSearch}
            className="mb-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="খুঁজুন..."
              className={cx(styles.input, "w-full px-4 opacity-100")}
            />
            <button
              type="submit"
              aria-label="সার্চ করুন"
              className={cx(styles.iconBtn, "shrink-0")}
            >
              <SearchIcon />
            </button>
          </form>

          <Link href={"/products"}>
            <span className="mt-1 px-1 text-lg uppercase tracking-wide text-black dark:text-[#F6F1E9]/40">
              প্রোডাক্ট
            </span>
          </Link>
          {CATEGORIES.map((c) => (
            <a
              key={c.href}
              href={c.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-1 py-2 text-[#202A44] transition-colors hover:bg-[#E2A227]/15 hover:text-[#B1502F] dark:text-[#F6F1E9] dark:hover:bg-[#E2A227]/10 dark:hover:text-[#E2A227]"
            >
              {c.label}
            </a>
          ))}

          <div className="my-2 h-px bg-[#202A44]/10 dark:bg-[#F6F1E9]/10" />

          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-1 py-2 text-[#202A44] dark:text-[#F6F1E9]"
            >
              {l.label}
            </a>
          ))}

          <div className="mt-3 flex items-center justify-between">
            <Link href="/dashboard?tab=cart" onClick={() => setOpen(false)}>
              <CartButton
                count={cartCount}
                className="relative rounded-full p-2 hover:bg-[#202A44]/5 dark:hover:bg-white/10"
              />
            </Link>
            {user && (
              <button
                onClick={() => {
                  signOut({});
                  setOpen(false);
                }}
                className="rounded-full border border-[#202A44]/20 px-4 py-1.5 text-xs text-[#202A44] dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9]"
              >
                লগআউট
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function Dropdown({
  open,
  align,
  children,
}: {
  open: boolean;
  align: "left" | "right" | "center";
  children: React.ReactNode;
}) {
  const pos =
    align === "center"
      ? "left-1/2 w-56 -translate-x-1/2"
      : align === "right"
        ? "right-0 w-52"
        : "left-0 w-52";
  return (
    <div
      className={cx(
        "absolute top-full pt-3 transition-all duration-200",
        pos,
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-1 opacity-0",
      )}
    >
      <div className={styles.panel}>{children}</div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#B1502F] font-[family-name:var(--font-display)] text-sm text-white">
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function CartButton({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <span aria-label="কার্ট" className={className}>
      <CartIcon />
      {count > 0 && (
        <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-[#B1502F] font-[family-name:var(--font-mono)] text-[10px] text-white">
          {count}
        </span>
      )}
    </span>
  );
}

const CartIcon = () => (
  <svg
    width="20"
    height="20"
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
const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const SunIcon = () => (
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
const MoonIcon = () => (
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
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className={cx(
      "text-[#E2A227] transition-transform duration-200",
      open && "rotate-180",
    )}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const MenuIcon = ({ open }: { open: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {open ? (
      <path d="M18 6 6 18M6 6l12 12" />
    ) : (
      <path d="M3 6h18M3 12h18M3 18h18" />
    )}
  </svg>
);
