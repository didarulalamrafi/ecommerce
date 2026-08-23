"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/products";
import { ApiError } from "@/lib/api";
import type { Product } from "@/types";

const EMPTY_FORM = {
  name: "",
  nameEn: "",
  artisan: "",
  price: "",
  image: "",
  category: "",
  tag: "",
  stock: "",
};

// ---- স্ট্যাটাস ব্যাজের জন্য ছোট হেল্পার কম্পোনেন্ট ----
function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: {
      label: "রিভিউ পেন্ডিং",
      className: "bg-[#E2A227]/15 text-[#E2A227] border border-[#E2A227]/40",
    },
    approved: {
      label: "অ্যাপ্রুভড",
      className: "bg-green-600/10 text-green-700 border border-green-600/30",
    },
    rejected: {
      label: "রিজেক্টেড",
      className: "bg-[#B1502F]/10 text-[#B1502F] border border-[#B1502F]/30",
    },
  };

  const s = map[status || "pending"] || map.pending;

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${s.className}`}
    >
      {s.label}
    </span>
  );
}

// admin/products/page.tsx এর প্রায় হুবহু কপি — পার্থক্য দুইটা জায়গায়:
// ১. role check করে "seller" (admin ও ঢুকতে পারবে চাইলে নিচে বদলাও)
// ২. getProducts() এর বদলে getMyProducts() — শুধু নিজের প্রোডাক্ট আসবে
export default function SellerProductsPage() {
  const { data: session, isPending: authLoading } = useSession();
  const router = useRouter();

  const role = session?.user?.role;
  const canAccess = role === "seller" || role === "admin";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!session?.user || !canAccess)) {
      router.push("/");
    }
  }, [authLoading, session, canAccess, router]);

  async function loadProducts() {
    try {
      const res = await getMyProducts();
      setProducts(res.products);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "প্রোডাক্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canAccess) loadProducts();
  }, [canAccess]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(product: Product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      nameEn: product.nameEn || "",
      artisan: (product.artisan as string) || "",
      price: String(product.price),
      image: product.image || "",
      category: product.category,
      tag: (product.tag as string) || "",
      stock: String((product.stock as number) ?? ""),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        // নিজের প্রোডাক্ট না হলে backend 403 দেবে (verifyProductOwnerOrAdmin)
        // নোট: এডিট করলে backend চাইলে status আবার "pending" এ রিসেট করে দিতে পারে
        // (approved প্রোডাক্ট বদলালে আবার রিভিউ দরকার হতে পারে) — এটা backend এর সিদ্ধান্ত।
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload); // backend নিজে থেকেই sellerId + status:"pending" বসিয়ে দেয়
      }
      resetForm();
      await loadProducts();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "প্রোডাক্ট সেভ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("এই প্রোডাক্টটি ডিলিট করতে চান?")) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "ডিলিট করা যায়নি");
    }
  }

  if (authLoading || !canAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        লোড হচ্ছে...
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-sm text-[#202A44] outline-none focus:border-[#E2A227] focus:ring-2 focus:ring-[#E2A227]/30 dark:border-[#F6F1E9]/15 dark:bg-white/5 dark:text-[#F6F1E9]";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl text-[#202A44] dark:text-[#F6F1E9]">
        আমার প্রোডাক্ট
      </h1>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-3 rounded-2xl border border-[#202A44]/10 p-6 dark:border-[#F6F1E9]/10"
        >
          <h2 className="mb-2 text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            {editingId ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট যোগ করুন"}
          </h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="নাম (বাংলা)"
            required
            className={inputClass}
          />
          <input
            name="nameEn"
            value={form.nameEn}
            onChange={handleChange}
            placeholder="Name (English)"
            className={inputClass}
          />
          <input
            name="artisan"
            value={form.artisan}
            onChange={handleChange}
            placeholder="কারিগর / বিবরণ"
            className={inputClass}
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="দাম (৳)"
            required
            className={inputClass}
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="ছবির URL"
            required
            className={inputClass}
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="ক্যাটাগরি"
            required
            className={inputClass}
          />
          <input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="ট্যাগ (যেমন: নতুন, ছাড়)"
            className={inputClass}
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="স্টক"
            required
            className={inputClass}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-[#202A44] py-2 text-sm text-[#F6F1E9] transition hover:opacity-90 disabled:opacity-50 dark:bg-[#F6F1E9] dark:text-[#202A44]"
            >
              {saving ? "সেভ হচ্ছে..." : editingId ? "আপডেট করুন" : "যোগ করুন"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-[#202A44]/20 px-4 py-2 text-sm text-[#202A44] dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9]"
              >
                বাতিল
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              লোড হচ্ছে...
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              এখনো কোনো প্রোডাক্ট যোগ করেননি
            </p>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-4 rounded-xl border border-[#202A44]/10 p-3 dark:border-[#F6F1E9]/10"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                        {p.name}
                      </p>
                      <StatusBadge status={(p as any).status} />
                    </div>
                    <p className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                      {p.category} • ৳{p.price} • স্টক: {String(p.stock ?? "-")}
                    </p>
                    {/* রিজেক্ট হলে কারণ দেখাও */}
                    {(p as any).status === "rejected" &&
                      (p as any).rejectionReason && (
                        <p className="mt-1 text-xs text-[#B1502F]">
                          কারণ: {(p as any).rejectionReason}
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="rounded-full border border-[#202A44]/20 px-3 py-1 text-xs text-[#202A44] dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9]"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="rounded-full border border-[#B1502F]/30 px-3 py-1 text-xs text-[#B1502F] dark:text-[#E2A227]"
                  >
                    ডিলিট
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
