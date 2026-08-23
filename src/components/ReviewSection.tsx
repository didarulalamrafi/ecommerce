"use client";

import { useEffect, useState } from "react";

/**
 * প্রোডাক্ট পেজে ব্যবহার করবে এভাবে:
 *   <ReviewSection productId={product._id} />
 *
 * তোমার MongoDB backend এর সাথে কানেক্টেড:
 *   GET  /api/reviews/:productId  -> রিভিউ লোড করে
 *   POST /api/reviews             -> নতুন রিভিউ সেভ করে
 */

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ecommerce-server-woad.vercel.app";

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ফর্মের state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // ✅ প্রোডাক্টের রিভিউগুলো লোড করা
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("রিভিউ লোড করতে সমস্যা হয়েছে");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchReviews();
  }, [productId]);

  // ✅ নতুন রিভিউ সাবমিট করা
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !comment.trim() || rating === 0) {
      setError("নাম, রেটিং এবং মন্তব্য — সবগুলো দিতে হবে।");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "রিভিউ সাবমিট করতে সমস্যা হয়েছে");
      }

      const newReview = await res.json();

      // ✅ নতুন রিভিউ লিস্টের উপরে যোগ করা, আবার পুরো fetch করার দরকার নেই
      setReviews((prev) => [newReview, ...prev]);

      // ফর্ম রিসেট
      setName("");
      setRating(0);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু একটা ভুল হয়েছে");
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "০";

  return (
    <section className="mx-auto max-w-4xl px-5 py-10 md:px-8">
      <h2 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[#14213D]">
        কাস্টমার রিভিউ
      </h2>

      {/* ========== সামারি ========== */}
      {!loading && reviews.length > 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm text-[#14213D]/60">
          <StarRow rating={Math.round(Number(avgRating))} />
          <span className="font-medium text-[#14213D]">{avgRating}</span>
          <span>({reviews.length}টি রিভিউ)</span>
        </div>
      )}

      {/* ========== রিভিউ ফর্ম ========== */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-2xl border border-[#14213D]/10 bg-[#F5F6F8] p-5"
      >
        <h3 className="mb-4 text-sm font-semibold text-[#14213D]">
          আপনার মতামত জানান
        </h3>

        <div className="mb-3">
          <input
            type="text"
            placeholder="আপনার নাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[#14213D]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#FF5A1F]"
            maxLength={60}
          />
        </div>

        <div className="mb-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${star} স্টার`}
              className="p-0.5"
            >
              <StarIcon filled={star <= (hoverRating || rating)} />
            </button>
          ))}
        </div>

        <div className="mb-4">
          <textarea
            placeholder="প্রোডাক্ট সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={1000}
            className="w-full resize-none rounded-xl border border-[#14213D]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#FF5A1F]"
          />
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#14213D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#FF5A1F] disabled:opacity-50"
        >
          {submitting ? "সাবমিট হচ্ছে..." : "রিভিউ জমা দিন"}
        </button>
      </form>

      {/* ========== রিভিউ লিস্ট ========== */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-[#F5F6F8] p-4">
              <div className="mb-2 h-4 w-1/4 rounded bg-[#14213D]/10" />
              <div className="h-3 w-3/4 rounded bg-[#14213D]/10" />
            </div>
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <p className="text-sm text-[#14213D]/50">
          এখনো কোনো রিভিউ নেই। প্রথম রিভিউ আপনিই দিন!
        </p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border-b border-[#14213D]/10 pb-5 last:border-b-0"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#14213D]">
                  {r.name}
                </span>
                <span className="text-xs text-[#14213D]/40">
                  {new Date(r.createdAt).toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <StarRow rating={r.rating} />
              <p className="mt-2 text-sm leading-relaxed text-[#14213D]/70">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} small />
      ))}
    </div>
  );
}

function StarIcon({ filled, small }: { filled: boolean; small?: boolean }) {
  const size = small ? 14 : 22;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#FFC93C" : "none"}
      stroke="#FFC93C"
      strokeWidth="1.5"
    >
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  );
}
