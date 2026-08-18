"use client";

import { useState } from "react";

/**
 * Modern sticky navbar for Maati.
 * Uses the same design tokens as the homepage:
 * bg #F6F1E9, ink #202A44, terracotta #B1502F, turmeric #E2A227
 * Fonts: --font-display (Fraunces), --font-mono (IBM Plex Mono)
 * These CSS vars are already set on <body> by the homepage's font setup.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#202A44]/10 bg-[#F6F1E9]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#202A44] font-[family-name:var(--font-display)] text-lg italic">
            ম
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
            Maati
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a
            href="/products"
            className="relative py-1 text-[#202A44] transition-colors hover:text-[#B1502F] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#B1502F] after:transition-all hover:after:w-full"
          >
            প্রোডাক্ট
          </a>
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            aria-label="কার্ট"
            className="relative rounded-full p-2.5 text-[#202A44] transition-colors hover:bg-[#202A44]/5"
          >
            <CartIcon />
            <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-[#B1502F] font-[family-name:var(--font-mono)] text-[10px] text-white">
              0
            </span>
          </button>

          <button className="rounded-full border border-[#202A44] px-6 py-2 text-sm text-[#202A44] transition-colors hover:bg-[#202A44] hover:text-[#F6F1E9]">
            লগইন
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 md:hidden"
          aria-label="মেনু খুলুন"
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-[#202A44]/10 transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-60" : "max-h-0 border-t-0"
        }`}
      >
        <nav className="flex flex-col gap-4 px-5 py-5 text-sm font-medium">
          <a href="/products" onClick={() => setOpen(false)}>
            প্রোডাক্ট
          </a>
          <div className="mt-2 flex items-center justify-between">
            <button
              aria-label="কার্ট"
              className="relative rounded-full p-2 hover:bg-[#202A44]/5"
              onClick={() => setOpen(false)}
            >
              <CartIcon />
              <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-[#B1502F] font-[family-name:var(--font-mono)] text-[10px] text-white">
                0
              </span>
            </button>
            <button
              className="rounded-full border border-[#202A44] px-6 py-2 text-sm text-[#202A44]"
              onClick={() => setOpen(false)}
            >
              লগইন
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
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
}

function MenuIcon({ open }: { open: boolean }) {
  return (
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
}
