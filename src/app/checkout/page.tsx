"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

const API_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://ecommerce-server-woad.vercel.app";

// 👉 তোমার দোকানের বিকাশ নাম্বার এখানে বসাও
const STORE_BKASH_NUMBER = "01XXXXXXXXX";

// ✅ ডেলিভারি চার্জ — backend এর সাথে মিলিয়ে রাখা (orderController.js এ DELIVERY_CHARGE)
const DELIVERY_CHARGE = 120;

// বাংলাদেশের ৬৪ জেলা
const DISTRICTS = [
  "বাগেরহাট",
  "বান্দরবান",
  "বরগুনা",
  "বরিশাল",
  "ভোলা",
  "বগুড়া",
  "ব্রাহ্মণবাড়িয়া",
  "চাঁদপুর",
  "চট্টগ্রাম",
  "চুয়াডাঙ্গা",
  "কুমিল্লা",
  "কক্সবাজার",
  "ঢাকা",
  "দিনাজপুর",
  "ফরিদপুর",
  "ফেনী",
  "গাইবান্ধা",
  "গাজীপুর",
  "গোপালগঞ্জ",
  "হবিগঞ্জ",
  "জামালপুর",
  "যশোর",
  "ঝালকাঠি",
  "ঝিনাইদহ",
  "জয়পুরহাট",
  "খাগড়াছড়ি",
  "খুলনা",
  "কিশোরগঞ্জ",
  "কুড়িগ্রাম",
  "কুষ্টিয়া",
  "লক্ষ্মীপুর",
  "লালমনিরহাট",
  "মাদারীপুর",
  "মাগুরা",
  "মানিকগঞ্জ",
  "মেহেরপুর",
  "মৌলভীবাজার",
  "মুন্সিগঞ্জ",
  "ময়মনসিংহ",
  "নওগাঁ",
  "নড়াইল",
  "নারায়ণগঞ্জ",
  "নরসিংদী",
  "নাটোর",
  "নেত্রকোণা",
  "নীলফামারী",
  "নোয়াখালী",
  "পাবনা",
  "পঞ্চগড়",
  "পটুয়াখালী",
  "পিরোজপুর",
  "রাজবাড়ী",
  "রাজশাহী",
  "রাঙামাটি",
  "রংপুর",
  "সাতক্ষীরা",
  "শরীয়তপুর",
  "শেরপুর",
  "সিরাজগঞ্জ",
  "সুনামগঞ্জ",
  "সিলেট",
  "টাঙ্গাইল",
  "ঠাকুরগাঁও",
].sort((a, b) => a.localeCompare(b, "bn"));

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

type PaymentMethod = "cod" | "bkash";

export default function CheckoutPage() {
  const router = useRouter();
  const { refreshCart } = useCart();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ঠিকানা ফর্ম
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [area, setArea] = useState("");
  const [addressLine, setAddressLine] = useState("");

  // পেমেন্ট
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/cart`, { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((data: CartItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoadingCart(false));
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const grandTotal = subtotal + DELIVERY_CHARGE;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !name.trim() ||
      !phone.trim() ||
      !district ||
      !upazila.trim() ||
      !area.trim()
    ) {
      setError("ঠিকানার সব তথ্য পূরণ করুন");
      return;
    }
    if (
      paymentMethod === "bkash" &&
      (!senderNumber.trim() || !transactionId.trim())
    ) {
      setError("বিকাশ নাম্বার এবং ট্রানজেকশন আইডি দিন");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          deliveryAddress: {
            name,
            phone,
            district,
            upazila,
            area,
            addressLine,
          },
          paymentMethod,
          payment:
            paymentMethod === "bkash"
              ? { senderNumber, transactionId }
              : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "অর্ডার করতে সমস্যা হয়েছে");

      refreshCart(); // Navbar badge খালি করা
      router.push(`/dashboard?tab=orders`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু একটা ভুল হয়েছে");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCart) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        লোড হচ্ছে...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        <p>কার্ট খালি, চেকআউট করার কিছু নেই</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl text-[#202A44] dark:text-[#F6F1E9]">
        চেকআউট
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========== অর্ডার সামারি ========== */}
        <section className="rounded-2xl border border-[#202A44]/10 p-5 dark:border-[#F6F1E9]/10">
          <h2 className="mb-4 text-sm font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            অর্ডার সামারি
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm text-[#202A44]/70 dark:text-[#F6F1E9]/70"
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-[family-name:var(--font-mono)]">
                  ৳{(item.price * item.qty).toLocaleString("bn-BD")}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-1.5 border-t border-dashed border-[#202A44]/10 pt-3 dark:border-[#F6F1E9]/10">
            <div className="flex justify-between text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              <span>সাবটোটাল</span>
              <span className="font-[family-name:var(--font-mono)]">
                ৳{subtotal.toLocaleString("bn-BD")}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              <span>ডেলিভারি চার্জ</span>
              <span className="font-[family-name:var(--font-mono)]">
                ৳{DELIVERY_CHARGE.toLocaleString("bn-BD")}
              </span>
            </div>
          </div>

          <div className="mt-3 flex justify-between border-t border-[#202A44]/10 pt-3 text-base font-semibold text-[#202A44] dark:border-[#F6F1E9]/10 dark:text-[#F6F1E9]">
            <span>সর্বমোট</span>
            <span className="font-[family-name:var(--font-mono)]">
              ৳{grandTotal.toLocaleString("bn-BD")}
            </span>
          </div>
        </section>

        {/* ========== ডেলিভারি ঠিকানা ========== */}
        <section className="rounded-2xl border border-[#202A44]/10 p-5 dark:border-[#F6F1E9]/10">
          <h2 className="mb-4 text-sm font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            ডেলিভারি ঠিকানা
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-[#202A44]/15 bg-transparent px-4 py-2.5 text-sm text-[#202A44] outline-none focus:border-[#B1502F] dark:border-[#F6F1E9]/15 dark:text-[#F6F1E9]"
            />
            <input
              type="tel"
              placeholder="ফোন নাম্বার"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-[#202A44]/15 bg-transparent px-4 py-2.5 text-sm text-[#202A44] outline-none focus:border-[#B1502F] dark:border-[#F6F1E9]/15 dark:text-[#F6F1E9]"
            />

            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-xl border border-[#202A44]/15 bg-transparent px-4 py-2.5 text-sm text-[#202A44] outline-none focus:border-[#B1502F] dark:border-[#F6F1E9]/15 dark:bg-[#171A24] dark:text-[#F6F1E9]"
            >
              <option value="">জেলা বেছে নিন</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="উপজেলা / থানা"
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              className="rounded-xl border border-[#202A44]/15 bg-transparent px-4 py-2.5 text-sm text-[#202A44] outline-none focus:border-[#B1502F] dark:border-[#F6F1E9]/15 dark:text-[#F6F1E9]"
            />

            <input
              type="text"
              placeholder="এলাকা (মহল্লা/গ্রাম)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="rounded-xl border border-[#202A44]/15 bg-transparent px-4 py-2.5 text-sm text-[#202A44] outline-none focus:border-[#B1502F] dark:border-[#F6F1E9]/15 dark:text-[#F6F1E9] sm:col-span-2"
            />

            <textarea
              placeholder="বিস্তারিত ঠিকানা (বাড়ি নং, রোড নং — ঐচ্ছিক)"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              rows={2}
              className="resize-none rounded-xl border border-[#202A44]/15 bg-transparent px-4 py-2.5 text-sm text-[#202A44] outline-none focus:border-[#B1502F] dark:border-[#F6F1E9]/15 dark:text-[#F6F1E9] sm:col-span-2"
            />
          </div>
        </section>

        {/* ========== পেমেন্ট মেথড ========== */}
        <section className="rounded-2xl border border-[#202A44]/10 p-5 dark:border-[#F6F1E9]/10">
          <h2 className="mb-4 text-sm font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            পেমেন্ট মেথড
          </h2>

          <div className="space-y-3">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                paymentMethod === "cod"
                  ? "border-[#B1502F] bg-[#B1502F]/5"
                  : "border-[#202A44]/15 dark:border-[#F6F1E9]/15"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="accent-[#B1502F]"
              />
              <div>
                <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                  ক্যাশ অন ডেলিভারি
                </p>
                <p className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                  প্রোডাক্ট হাতে পেয়ে টাকা দিন
                </p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                paymentMethod === "bkash"
                  ? "border-[#B1502F] bg-[#B1502F]/5"
                  : "border-[#202A44]/15 dark:border-[#F6F1E9]/15"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "bkash"}
                onChange={() => setPaymentMethod("bkash")}
                className="accent-[#B1502F]"
              />
              <div>
                <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                  বিকাশ
                </p>
                <p className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                  Send Money করে অর্ডার নিশ্চিত করুন
                </p>
              </div>
            </label>

            {paymentMethod === "bkash" && (
              <div className="rounded-xl bg-[#E2A227]/10 p-4">
                <p className="mb-3 text-sm text-[#202A44] dark:text-[#F6F1E9]">
                  এই নাম্বারে{" "}
                  <span className="font-[family-name:var(--font-mono)] font-semibold">
                    ৳{grandTotal.toLocaleString("bn-BD")}
                  </span>{" "}
                  <strong>Send Money</strong> করুন:
                </p>
                <p className="mb-4 font-[family-name:var(--font-mono)] text-lg font-bold text-[#B1502F] dark:text-[#E2A227]">
                  {STORE_BKASH_NUMBER}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="tel"
                    placeholder="আপনার বিকাশ নাম্বার"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="rounded-xl border border-[#202A44]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#B1502F] dark:border-[#F6F1E9]/15 dark:bg-[#171A24] dark:text-[#F6F1E9]"
                  />
                  <input
                    type="text"
                    placeholder="ট্রানজেকশন আইডি (TrxID)"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="rounded-xl border border-[#202A44]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#B1502F] dark:border-[#F6F1E9]/15 dark:bg-[#171A24] dark:text-[#F6F1E9]"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#202A44] py-3.5 text-sm font-medium text-[#F6F1E9] transition hover:opacity-90 disabled:opacity-50 dark:bg-[#F6F1E9] dark:text-[#202A44]"
        >
          {submitting ? "অর্ডার হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
        </button>
      </form>
    </div>
  );
}
