"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useSession } from "../lib/auth-client";

/**
 * Product shape — matches the dummy documents seeded in MongoDB.
 * Exported so the products page (and anywhere else) can reuse the type.
 */
export interface Product {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  sellerName?: string; // NEW: যে seller প্রোডাক্টটি অ্যাড করেছে তার নাম
  price: number;
  oldPrice?: number;
  discount?: number;
  description: string;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  inCart?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToCart } = useCart();

  const [inCart, setInCart] = useState(product.inCart ?? false);
  const [adding, setAdding] = useState(false);
  const lowStock = product.stock > 0 && product.stock <= 10;
  const outOfStock = product.stock === 0;

  async function handleCartClick() {
    // লগইন করা না থাকলে লগইন পেজে পাঠিয়ে দেওয়া হবে
    if (!session) {
      router.push("/login");
      return;
    }
    if (outOfStock || adding) return;

    // ইতিমধ্যে কার্টে থাকলে টগল করা হচ্ছে না — শুধু যোগ করা যাবে,
    // সরানোর জন্য কার্ট পেজে যেতে হবে
    if (inCart) return;

    setAdding(true);
    const ok = await addToCart({
      productId: product._id ?? product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    });
    setAdding(false);
    if (ok) setInCart(true);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#202A44]/10 bg-[#FFFDF8] transition-shadow hover:shadow-lg">
      {/* image */}
      <a
        href={`/products/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-[#F6F1E9]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {!!product.discount && (
            <span className="rounded-full bg-[#B1502F] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-medium text-white">
              -{product.discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="rounded-full bg-[#E2A227] px-2 py-0.5 text-[11px] font-medium text-[#202A44]">
              ফিচার্ড
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-[#202A44]/50 backdrop-blur-[1px]">
            <span className="rounded-full bg-[#F6F1E9] px-3 py-1 text-xs font-medium text-[#202A44]">
              স্টক নেই
            </span>
          </div>
        )}
      </a>

      {/* content */}
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        {/* NEW: এখন brand-এর বদলে যে seller প্রোডাক্টটি বিক্রি করছে তার নাম দেখানো হচ্ছে */}
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#5B6B4C]">
          {product.sellerName || product.brand}
        </p>

        <a
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-[#202A44] hover:text-[#B1502F]"
        >
          {product.name}
        </a>

        {/* rating */}
        <div className="flex items-center gap-1.5 text-xs text-[#202A44]/60">
          <StarIcon />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-[#202A44]/30">·</span>
          <span>{product.reviewCount} রিভিউ</span>
        </div>

        {/* price + stock */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-mono)] text-base font-medium text-[#202A44]">
              ৳{product.price.toLocaleString("bn-BD")}
            </span>
            {!!product.oldPrice && (
              <span className="font-[family-name:var(--font-mono)] text-xs text-[#202A44]/40 line-through">
                ৳{product.oldPrice.toLocaleString("bn-BD")}
              </span>
            )}
            {lowStock && (
              <span className="mt-0.5 text-[11px] text-[#B1502F]">
                মাত্র {product.stock}টি বাকি
              </span>
            )}
          </div>

          <button
            disabled={outOfStock || adding}
            onClick={handleCartClick}
            aria-label={inCart ? "কার্টে আছে" : "কার্টে যোগ করুন"}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              inCart
                ? "bg-[#5B6B4C] text-white"
                : "bg-[#202A44] text-[#F6F1E9] hover:bg-[#B1502F]"
            }`}
          >
            {inCart ? <CheckIcon /> : <CartPlusIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- inline icons ---------- */

function StarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="#E2A227"
      stroke="#E2A227"
      strokeWidth="1"
    >
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l6.9-1z" />
    </svg>
  );
}
function CartPlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
      <path d="M15 8h4M17 6v4" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}
