"use client";

import { useState, useEffect, FormEvent } from "react";
import { createProduct, updateProduct } from "@/services/products";
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

function slugify(text: string) {
  const base = text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0980-\u09FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : `product-${suffix}`;
}

const CATEGORIES = [
  "ইলেকট্রনিক সামগ্রী",
  "খাদ্যপণ্য",
  "গৃহসামগ্রী",
  "প্রসাধনী সামগ্রী",
];

const inputClass =
  "w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-sm text-[#202A44] outline-none focus:border-[#E2A227] focus:ring-2 focus:ring-[#E2A227]/30 dark:border-[#F6F1E9]/15 dark:bg-white/5 dark:text-[#F6F1E9]";

export default function ProductForm({
  editingProduct,
  onSaved,
  onCancel,
}: {
  // পাস না করলে "create" মোড, প্রোডাক্ট পাস করলে "edit" মোড
  editingProduct?: Product | null;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // editingProduct চেঞ্জ হলে ফর্ম প্রি-ফিল হবে
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        nameEn: editingProduct.nameEn || "",
        artisan: (editingProduct.artisan as string) || "",
        price: String(editingProduct.price),
        image: editingProduct.image || "",
        category: editingProduct.category,
        tag: (editingProduct.tag as string) || "",
        stock: String((editingProduct.stock as number) ?? ""),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingProduct]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
      } else {
        const slug = slugify(form.nameEn || form.name);
        await createProduct({ ...payload, slug });
      }
      setForm(EMPTY_FORM);
      onSaved();
    } catch (err) {
      console.error("Product save failed:", err); // 🔍 ডিবাগের জন্য — কনসোলে আসল error দেখুন
      alert(err instanceof ApiError ? err.message : "প্রোডাক্ট সেভ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit space-y-3 rounded-2xl border border-[#202A44]/10 bg-[#F6F1E9] p-6 dark:border-[#F6F1E9]/10 dark:bg-[#202A44] lg:p-7"
    >
      <h2 className="mb-2 text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
        {editingProduct ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট যোগ করুন"}
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

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className={`${inputClass} ${
          form.category ? "" : "text-[#202A44]/40 dark:text-[#F6F1E9]/40"
        }`}
      >
        <option value="" disabled>
          ক্যাটাগরি নির্বাচন করুন
        </option>
        {CATEGORIES.map((c) => (
          <option
            key={c}
            value={c}
            className="text-[#202A44] dark:text-[#202A44]"
          >
            {c}
          </option>
        ))}
      </select>

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
          {saving ? "সেভ হচ্ছে..." : editingProduct ? "আপডেট করুন" : "যোগ করুন"}
        </button>
        {editingProduct && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#202A44]/20 px-4 py-2 text-sm text-[#202A44] dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9]"
          >
            বাতিল
          </button>
        )}
      </div>
    </form>
  );
}
