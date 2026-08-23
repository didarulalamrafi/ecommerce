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
import {
  getMySellerOrders,
  approveOrderItem,
  deliverOrderItem,
  cancelOrderItem,
} from "@/services/orders";
import { ApiError } from "@/lib/api";
import type { Product, Order, OrderItem, OrderItemStatus } from "@/types";

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

function ItemStatusBadge({ status }: { status?: OrderItemStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: {
      label: "নতুন",
      className: "bg-[#E2A227]/15 text-[#E2A227] border border-[#E2A227]/40",
    },
    approved: {
      label: "অ্যাপ্রুভড",
      className: "bg-blue-600/10 text-blue-700 border border-blue-600/30",
    },
    delivered: {
      label: "ডেলিভারড",
      className: "bg-green-600/10 text-green-700 border border-green-600/30",
    },
    cancelled: {
      label: "বাতিল",
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

function summaryStatus(items: OrderItem[]): OrderItemStatus {
  const priority: OrderItemStatus[] = [
    "pending",
    "approved",
    "delivered",
    "cancelled",
  ];
  for (const s of priority) {
    if (items.some((i) => i.status === s)) return s;
  }
  return "pending";
}

// ---- উন্নত অর্ডার কার্ড - আরও info সহ ----
function OrderCard({
  order,
  onOpen,
}: {
  order: Order;
  onOpen: (order: Order) => void;
}) {
  const myItems = order.items;
  const mySubtotal = myItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const status = summaryStatus(myItems);

  const statusConfig = {
    pending: { dot: "bg-[#E2A227]", light: "bg-[#E2A227]/10" },
    approved: { dot: "bg-blue-500", light: "bg-blue-500/10" },
    delivered: { dot: "bg-green-500", light: "bg-green-500/10" },
    cancelled: { dot: "bg-[#B1502F]", light: "bg-[#B1502F]/10" },
  };

  const sc = statusConfig[status];

  return (
    <button
      onClick={() => onOpen(order)}
      className="group flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#202A44]/10 bg-gradient-to-br from-white/80 to-white/60 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-[#F6F1E9]/10 dark:from-white/8 dark:to-white/4"
    >
      {/* Header with status */}
      <div
        className={`flex items-center justify-between gap-3 border-b border-[#202A44]/10 px-5 py-3 ${sc.light} dark:border-[#F6F1E9]/10`}
      >
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${sc.dot}`} />
          <span className="text-xs font-medium text-[#202A44]/70 dark:text-[#F6F1E9]/70">
            অর্ডার #{order._id.slice(-6).toUpperCase()}
          </span>
        </div>
        <ItemStatusBadge status={status} />
      </div>

      {/* Main content */}
      <div className="space-y-3 p-5">
        {/* Buyer info - prominent */}
        <div>
          <p className="text-sm font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            {order.buyer?.name || "অজানা ক্রেতা"}
          </p>
          {order.buyer?.number && (
            <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              📱 {order.buyer.number}
            </p>
          )}
          {order.shippingAddress && (
            <p className="line-clamp-1 text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
              📍 {order.shippingAddress}
            </p>
          )}
        </div>

        {/* Items & Price summary */}
        <div className="flex items-center justify-between rounded-lg bg-[#202A44]/5 px-3 py-2 dark:bg-white/5">
          <div>
            <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              {myItems.length} টি পণ্য
            </p>
            <p className="text-lg font-bold text-[#202A44] dark:text-[#F6F1E9]">
              ৳{mySubtotal.toLocaleString("bn-BD")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              মোট আইটেম
            </p>
            <p className="text-2xl font-bold text-[#202A44]/30 dark:text-[#F6F1E9]/30">
              {myItems.length}
            </p>
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-[#202A44]/40 dark:text-[#F6F1E9]/40">
          {new Date(order.createdAt).toLocaleDateString("bn-BD", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {" • "}
          {new Date(order.createdAt).toLocaleTimeString("bn-BD", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* CTA hint */}
      <div className="border-t border-[#202A44]/10 px-5 py-2.5 text-center text-xs text-[#202A44]/50 transition group-hover:text-[#202A44] dark:border-[#F6F1E9]/10 dark:text-[#F6F1E9]/50 dark:group-hover:text-[#F6F1E9]">
        বিস্তারিত দেখুন →
      </div>
    </button>
  );
}

function OrderItemRow({
  orderId,
  item,
  onChanged,
}: {
  orderId: string;
  item: OrderItem;
  onChanged: () => void;
}) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState(item.note || "");
  const [busy, setBusy] = useState(false);

  async function handleApprove() {
    setBusy(true);
    try {
      await approveOrderItem(orderId, item.productId);
      onChanged();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "অ্যাপ্রুভ করা যায়নি");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeliver() {
    if (!showNoteInput) {
      setShowNoteInput(true);
      return;
    }
    setBusy(true);
    try {
      await deliverOrderItem(orderId, item.productId, note.trim());
      onChanged();
    } catch (err) {
      alert(
        err instanceof ApiError ? err.message : "ডেলিভারড মার্ক করা যায়নি",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    if (
      !confirm(
        "এই পণ্যের অর্ডারটি বাতিল/ডিলিট করতে চান? ক্রেতা তার ড্যাশবোর্ডে দেখতে পাবে।",
      )
    )
      return;
    setBusy(true);
    try {
      await cancelOrderItem(orderId, item.productId);
      onChanged();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "বাতিল করা যায়নি");
    } finally {
      setBusy(false);
    }
  }

  const isFinal = item.status === "delivered" || item.status === "cancelled";

  return (
    <div className="rounded-xl border border-[#202A44]/10 p-4 dark:border-[#F6F1E9]/10">
      <div className="mb-3 flex gap-3">
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="h-16 w-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <p className="font-medium text-[#202A44] dark:text-[#F6F1E9]">
            {item.name}
          </p>
          <p className="text-sm text-[#202A44]/50 dark:text-[#F6F1E9]/50">
            {item.qty} × ৳{item.price} ={" "}
            <span className="font-semibold">৳{item.qty * item.price}</span>
          </p>
        </div>
        <ItemStatusBadge status={item.status} />
      </div>

      {item.note && !showNoteInput && (
        <div className="mb-3 rounded-lg bg-[#E2A227]/10 p-3 text-sm text-[#202A44] dark:text-[#F6F1E9]">
          <span className="font-medium">📝 নোট: </span>
          {item.note}
        </div>
      )}

      {showNoteInput && (
        <div className="mb-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="ডেলিভারি নোট লিখুন (ক্রেতা দেখতে পাবে)..."
            className="w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-sm text-[#202A44] outline-none focus:border-[#E2A227] focus:ring-2 focus:ring-[#E2A227]/30 dark:border-[#F6F1E9]/15 dark:bg-white/5 dark:text-[#F6F1E9]"
          />
        </div>
      )}

      {!isFinal && (
        <div className="flex flex-wrap gap-2 pt-2">
          {item.status === "pending" && (
            <button
              onClick={handleApprove}
              disabled={busy}
              className="flex-1 rounded-full bg-blue-600 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              ✓ অ্যাপ্রুভ
            </button>
          )}
          <button
            onClick={handleDeliver}
            disabled={busy}
            className="flex-1 rounded-full bg-green-600 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {showNoteInput
              ? busy
                ? "সেভ হচ্ছে..."
                : "নোটসহ ডেলিভারড"
              : "✓ ডেলিভারড"}
          </button>
          <button
            onClick={handleCancel}
            disabled={busy}
            className="flex-1 rounded-full border border-[#B1502F]/30 py-2 text-sm font-medium text-[#B1502F] transition hover:bg-[#B1502F]/5 disabled:opacity-50 dark:text-[#E2A227] dark:hover:bg-[#E2A227]/10"
          >
            ✕ ডিলিট
          </button>
        </div>
      )}
    </div>
  );
}

// ---- উন্নত মোডাল - আরও spacious ----
function OrderDetailsModal({
  order,
  onClose,
  onChanged,
}: {
  order: Order;
  onClose: () => void;
  onChanged: () => void;
}) {
  const myItems = order.items;
  const mySubtotal = myItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#F6F1E9] p-7 dark:bg-[#202A44]"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              অর্ডার নম্বর
            </p>
            <h3 className="text-2xl font-bold text-[#202A44] dark:text-[#F6F1E9]">
              #{order._id.slice(-6).toUpperCase()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#202A44]/60 hover:bg-[#202A44]/5 dark:text-[#F6F1E9]/60 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Buyer Info - Prominent Card */}
        <div className="mb-6 space-y-4 rounded-2xl border border-[#202A44]/10 bg-gradient-to-br from-[#E2A227]/10 to-transparent p-5 dark:border-[#F6F1E9]/10 dark:from-[#E2A227]/20">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              ক্রেতার তথ্য
            </p>
            <p className="text-lg font-bold text-[#202A44] dark:text-[#F6F1E9]">
              {order.buyer?.name || "অজানা"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {order.buyer?.number && (
              <div className="rounded-lg bg-white/50 p-3 dark:bg-white/10">
                <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
                  ফোন নম্বর
                </p>
                <div className="flex items-center justify-between pt-1">
                  <p className="font-mono font-medium text-[#202A44] dark:text-[#F6F1E9]">
                    {order.buyer.number}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(order.buyer?.number || "");
                    }}
                    className="text-xs text-[#202A44]/50 hover:text-[#202A44] dark:text-[#F6F1E9]/50 dark:hover:text-[#F6F1E9]"
                  >
                    📋 কপি
                  </button>
                </div>
              </div>
            )}

            {order.buyer?.email && (
              <div className="rounded-lg bg-white/50 p-3 dark:bg-white/10">
                <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
                  ইমেইল
                </p>
                <p className="truncate font-mono text-sm text-[#202A44] dark:text-[#F6F1E9]">
                  {order.buyer.email}
                </p>
              </div>
            )}
          </div>

          {order.shippingAddress && (
            <div className="rounded-lg bg-white/50 p-3 dark:bg-white/10">
              <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
                ডেলিভারি ঠিকানা
              </p>
              <p className="pt-1 text-sm text-[#202A44] dark:text-[#F6F1E9]">
                {order.shippingAddress}
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#202A44]/10 p-3 dark:border-[#F6F1E9]/10">
            <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              মোট আইটেম
            </p>
            <p className="pt-1 text-2xl font-bold text-[#202A44] dark:text-[#F6F1E9]">
              {myItems.length}
            </p>
          </div>
          <div className="rounded-lg border border-[#202A44]/10 p-3 dark:border-[#F6F1E9]/10">
            <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              মোট পরিমাণ
            </p>
            <p className="pt-1 text-2xl font-bold text-[#202A44] dark:text-[#F6F1E9]">
              ৳{mySubtotal.toLocaleString("bn-BD")}
            </p>
          </div>
          <div className="rounded-lg border border-[#202A44]/10 p-3 dark:border-[#F6F1E9]/10">
            <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              অর্ডার তারিখ
            </p>
            <p className="pt-1 text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
              {new Date(order.createdAt).toLocaleDateString("bn-BD")}
            </p>
          </div>
        </div>

        {/* Items */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            অর্ডার আইটেম ({myItems.length})
          </h4>
          <div className="space-y-4">
            {myItems.map((item) => (
              <OrderItemRow
                key={item.productId}
                orderId={order._id}
                item={item}
                onChanged={onChanged}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerProductsPage() {
  const { data: session, isPending: authLoading } = useSession();
  const router = useRouter();

  const role = session?.user?.role;
  const canAccess = role === "seller" || role === "admin";

  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  async function loadOrders() {
    try {
      const res = await getMySellerOrders();
      setOrders(res);
      setSelectedOrder((prev) =>
        prev ? res.find((o) => o._id === prev._id) || null : null,
      );
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "অর্ডার লোড করা যায়নি");
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    if (canAccess) {
      loadProducts();
      loadOrders();
    }
  }, [canAccess]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
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
        const slug = slugify(form.nameEn || form.name);
        await createProduct({ ...payload, slug });
      }
      resetForm();
      await loadProducts();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "প্রোডাক্ট সেভ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id: string) {
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

  const pendingCount = orders.filter((o) =>
    o.items.some((i) => i.status === "pending"),
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:px-10 lg:py-14">
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl text-[#202A44] dark:text-[#F6F1E9] lg:text-4xl">
        সেলার ড্যাশবোর্ড
      </h1>

      <div className="mb-8 flex w-fit gap-2 rounded-full border border-[#202A44]/10 p-1 dark:border-[#F6F1E9]/10">
        <button
          onClick={() => setActiveTab("products")}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            activeTab === "products"
              ? "bg-[#202A44] text-[#F6F1E9] dark:bg-[#F6F1E9] dark:text-[#202A44]"
              : "text-[#202A44]/60 dark:text-[#F6F1E9]/60"
          }`}
        >
          আমার প্রোডাক্ট
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            activeTab === "orders"
              ? "bg-[#202A44] text-[#F6F1E9] dark:bg-[#F6F1E9] dark:text-[#202A44]"
              : "text-[#202A44]/60 dark:text-[#F6F1E9]/60"
          }`}
        >
          আমার অর্ডার
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E2A227] text-xs font-bold text-white">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === "products" ? (
        <div className="grid gap-8 lg:grid-cols-[420px_1fr] xl:grid-cols-[460px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit space-y-3 rounded-2xl border border-[#202A44]/10 p-6 dark:border-[#F6F1E9]/10 lg:sticky lg:top-6 lg:p-7"
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
                {saving
                  ? "সেভ হচ্ছে..."
                  : editingId
                    ? "আপডেট করুন"
                    : "যোগ করুন"}
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

          <div>
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
                          onClick={() => startEdit(p)}
                          className="flex-1 rounded-full border border-[#202A44]/20 px-3 py-1.5 text-xs text-[#202A44] transition hover:bg-[#202A44]/5 dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9] dark:hover:bg-white/10"
                        >
                          এডিট
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
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
          </div>
        </div>
      ) : (
        <div>
          {loadingOrders ? (
            <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              লোড হচ্ছে...
            </p>
          ) : orders.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#202A44]/15 text-center dark:border-[#F6F1E9]/15">
              <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
                এখনো কোনো অর্ডার আসেনি
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {orders.map((o) => (
                <OrderCard key={o._id} order={o} onOpen={setSelectedOrder} />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onChanged={loadOrders}
        />
      )}
    </div>
  );
}
