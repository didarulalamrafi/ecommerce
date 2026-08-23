"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getPendingProducts,
  approveProduct,
  rejectProduct,
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

export default function AdminProductsPage() {
  const { data: session, isPending: authLoading } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.role === "admin";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Pending (review-এ থাকা) প্রোডাক্ট
  const [pending, setPending] = useState<Product[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingNotes, setPendingNotes] = useState<Record<string, string>>({});
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!session?.user || !isAdmin)) {
      router.push("/");
    }
  }, [authLoading, session, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadPending();
    }
  }, [isAdmin]);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 50 });
      setProducts(res.products);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "প্রোডাক্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  async function loadPending() {
    setPendingLoading(true);
    try {
      const res = await getPendingProducts();
      setPending(res.products);
    } catch (err) {
      console.error(err);
    } finally {
      setPendingLoading(false);
    }
  }

  function handleNoteChange(id: string, value: string) {
    setPendingNotes((prev) => ({ ...prev, [id]: value }));
  }

  async function handleApprove(id: string) {
    setActioningId(id);
    try {
      await approveProduct(id, pendingNotes[id]?.trim() || undefined);
      setPendingNotes((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await loadPending();
      await loadProducts();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "অ্যাপ্রুভ করা যায়নি");
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(id: string) {
    if (!confirm("এই প্রোডাক্টটি রিজেক্ট করতে চান? এটি ডিলিট হয়ে যাবে।"))
      return;

    setActioningId(id);
    try {
      await rejectProduct(id, pendingNotes[id]?.trim() || undefined);
      setPendingNotes((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await loadPending();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "রিজেক্ট করা যায়নি");
    } finally {
      setActioningId(null);
    }
  }

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
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
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

  if (authLoading || !isAdmin) {
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
        প্রোডাক্ট ম্যানেজমেন্ট
      </h1>

      {/* Pending review section */}
      <div className="mb-10 rounded-2xl border border-[#E2A227]/40 bg-[#E2A227]/5 p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
          রিভিউ এর অপেক্ষায় ({pending.length})
        </h2>

        {pendingLoading ? (
          <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            লোড হচ্ছে...
          </p>
        ) : pending.length === 0 ? (
          <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            রিভিউ এর জন্য কোনো প্রোডাক্ট নেই
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((p) => (
              <div
                key={p._id}
                className="rounded-xl border border-[#202A44]/10 bg-white/60 p-4 dark:border-[#F6F1E9]/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                        {p.name}
                      </p>
                      <p className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                        {p.category} • ৳{p.price} • স্টক:{" "}
                        {String(p.stock ?? "-")}
                      </p>
                      {p.seller && (
                        <p className="mt-1 text-xs text-[#202A44]/40 dark:text-[#F6F1E9]/40">
                          বিক্রেতা:{" "}
                          {(p.seller as { name?: string })?.name ?? "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <textarea
                  value={pendingNotes[p._id] ?? ""}
                  onChange={(e) => handleNoteChange(p._id, e.target.value)}
                  placeholder="সেলারের জন্য নোট (ঐচ্ছিক)"
                  rows={2}
                  className={`${inputClass} mt-3 resize-none`}
                />

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleApprove(p._id)}
                    disabled={actioningId === p._id}
                    className="rounded-full bg-[#1F7A4D] px-4 py-1.5 text-xs text-white transition hover:opacity-90 disabled:opacity-50"
                  >
                    {actioningId === p._id ? "..." : "অ্যাপ্রুভ"}
                  </button>
                  <button
                    onClick={() => handleReject(p._id)}
                    disabled={actioningId === p._id}
                    className="rounded-full border border-[#B1502F]/30 px-4 py-1.5 text-xs text-[#B1502F] transition hover:bg-[#B1502F]/10 disabled:opacity-50 dark:text-[#E2A227]"
                  >
                    {actioningId === p._id ? "..." : "রিজেক্ট"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Add/Edit form */}
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

        {/* Approved product list */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            অ্যাপ্রুভড প্রোডাক্ট (সাইটে দেখা যাচ্ছে)
          </h2>

          {loading ? (
            <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              লোড হচ্ছে...
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              কোনো প্রোডাক্ট নেই
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
                    <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                      {p.category} • ৳{p.price} • স্টক: {String(p.stock ?? "-")}
                    </p>
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
