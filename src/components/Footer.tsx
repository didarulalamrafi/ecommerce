"use client";

import { useState } from "react";

/**
 * Modern footer for Maati.
 * Same design tokens as Navbar/Home:
 * ink #202A44, bone #F6F1E9, terracotta #B1502F, turmeric #E2A227, olive #5B6B4C
 * Fonts: --font-display (Fraunces), --font-mono (IBM Plex Mono)
 */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-[#202A44] text-[#F6F1E9]">
      {/* faint signature seal, decorative */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-dashed border-[#F6F1E9]/10 md:h-80 md:w-80" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-20">
        {/* top: brand + newsletter */}
        <div className="grid gap-12 border-b border-[#F6F1E9]/10 pb-12 md:grid-cols-2 md:items-end">
          <div>
            <span className="font-[family-name:var(--font-display)] text-3xl italic tracking-tight">
              Maati
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#F6F1E9]/60">
              বাংলাদেশের কারিগরদের হাতে গড়া টেরাকোটা ও সিরামিক পণ্য — প্রতিটি
              পিস আলাদা, প্রতিটির পেছনে আছে একজন শিল্পীর গল্প।
            </p>
          </div>

          <div>
            <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[#E2A227]">
              নতুন সংগ্রহের খবর পান
            </p>
            {subscribed ? (
              <p className="text-sm text-[#E2A227]">
                ধন্যবাদ! আপনি যুক্ত হয়েছেন।
              </p>
            ) : (
              <form
                className="flex max-w-sm gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="আপনার ইমেইল"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-full border border-[#F6F1E9]/30 bg-transparent px-4 py-2 text-sm text-[#F6F1E9] outline-none placeholder:text-[#F6F1E9]/40 focus:border-[#F6F1E9]/60"
                />
                <button
                  type="submit"
                  aria-label="সাবস্ক্রাইব করুন"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E2A227] text-[#202A44] transition-colors hover:bg-[#c98f1f]"
                >
                  <ArrowIcon />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* middle: link columns */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <FooterCol
            title="শপ"
            items={[
              { label: "সব প্রোডাক্ট", href: "/products" },
              { label: "নতুন সংগ্রহ", href: "#" },
              { label: "বেস্টসেলার", href: "#" },
              { label: "অফার", href: "#" },
            ]}
          />
          <FooterCol
            title="সহায়তা"
            items={[
              { label: "ডেলিভারি নীতি", href: "#" },
              { label: "রিটার্ন ও রিফান্ড", href: "#" },
              { label: "যোগাযোগ", href: "#" },
              { label: "প্রশ্নোত্তর", href: "#" },
            ]}
          />
          <FooterCol
            title="কোম্পানি"
            items={[
              { label: "আমাদের গল্প", href: "/contact" },
              { label: "কারিগরেরা", href: "#" },
              { label: "ক্যারিয়ার", href: "#" },
            ]}
          />
          <div>
            <p className="mb-4 text-sm font-medium">যোগাযোগ</p>
            <ul className="space-y-3 text-sm text-[#F6F1E9]/60">
              <li>hello@maati.com.bd</li>
              <li>+৮৮০ ১৭xx-xxxxxx</li>
            </ul>
            <div className="mt-5 flex gap-3">
              <SocialIcon label="Facebook">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon label="Instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon label="WhatsApp">
                <WhatsAppIcon />
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t border-[#F6F1E9]/10 pt-6 text-xs text-[#F6F1E9]/50 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Maati. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#F6F1E9]">
              গোপনীয়তা নীতি
            </a>
            <a href="#" className="hover:text-[#F6F1E9]">
              শর্তাবলি
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- helpers ---------- */

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-sm font-medium">{title}</p>
      <ul className="space-y-3 text-sm text-[#F6F1E9]/60">
        {items.map((i) => (
          <li key={i.label}>
            <a href={i.href} className="transition-colors hover:text-[#F6F1E9]">
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-[#F6F1E9]/20 text-[#F6F1E9]/70 transition-colors hover:border-[#E2A227] hover:text-[#E2A227]"
    >
      {children}
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.3.1-.5.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.5-1.3-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}
