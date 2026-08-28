"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getMyProducts, deleteProduct } from "@/services/products";
import { ApiError } from "@/lib/api";
import type { Product } from "@/types";

import { useToast } from "../components/ToastProvider";
import ConfirmDialog from "../components/Confirmdialog";
import ProductForm from "../components/Productform";

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
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm ${s.className}`}
    >
      {s.label}
    </span>
  );
}

export default function MyProductsPage() {
  const { data: session, isPending: authLoading } = useSession();
  const router = useRouter();

  const role = session?.user?.role;
  const canAccess = role === "seller" || role === "admin";

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

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
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    if (canAccess) loadProducts();
  }, [canAccess]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id);
      await loadProducts();
      setDeleteTarget(null);
      showToast("প্রোডাক্ট ডিলিট করা হয়েছে ✅", "success");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "ডিলিট করা যায়নি",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (authLoading || !canAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:px-10 lg:py-14">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#202A44] dark:text-[#F6F1E9] lg:text-4xl">
          আমার প্রোডাক্ট
        </h1>
        {!loadingProducts && products.length > 0 && (
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#202A44]/10 px-2 text-xs font-bold text-[#202A44] dark:bg-white/10 dark:text-[#F6F1E9]">
            মোট {products.length}
          </span>
        )}
      </div>

      {loadingProducts ? (
        <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
          লোড হচ্ছে...
        </p>
      ) : products.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#202A44]/15 text-center dark:border-[#F6F1E9]/15">
          <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            এখনো কোনো প্রোডাক্ট যোগ করেননি
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#202A44]/10 bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-[#F6F1E9]/10 dark:bg-white/5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#202A44]/5 dark:bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute left-2 top-2">
                  <StatusBadge status={(p as any).status} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="mb-1 line-clamp-1 text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                  {p.name}
                </p>
                <p className="mb-1 text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                  {p.category}
                </p>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#202A44] dark:text-[#F6F1E9]">
                    ৳{p.price}
                  </span>
                  <span className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                    স্টক: {String(p.stock ?? "-")}
                  </span>
                </div>

                {(p as any).status === "rejected" &&
                  (p as any).rejectionReason && (
                    <p className="mb-2 line-clamp-2 text-xs text-[#B1502F]">
                      কারণ: {(p as any).rejectionReason}
                    </p>
                  )}

                <div className="mt-auto flex gap-2 pt-2">
                  <button
                    onClick={() => setEditingProduct(p)}
                    className="flex-1 rounded-full border border-[#202A44]/20 px-3 py-1.5 text-xs text-[#202A44] transition hover:bg-[#202A44]/5 dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9] dark:hover:bg-white/10"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="flex-1 rounded-full border border-[#B1502F]/30 px-3 py-1.5 text-xs text-[#B1502F] transition hover:bg-[#B1502F]/5 dark:text-[#E2A227] dark:hover:bg-[#E2A227]/10"
                  >
                    ডিলিট
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setEditingProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto"
          >
            <ProductForm
              editingProduct={editingProduct}
              onSaved={() => {
                setEditingProduct(null);
                loadProducts();
              }}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="এই প্রোডাক্টটি ডিলিট করতে চান?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" স্থায়ীভাবে মুছে যাবে, এটি আর ফিরিয়ে আনা যাবে না।`
            : undefined
        }
        confirmLabel={deleting ? "ডিলিট হচ্ছে..." : "ডিলিট করুন"}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
