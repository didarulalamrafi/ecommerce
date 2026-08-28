"use client";

import { useState } from "react";
import type { Order, OrderItem, OrderItemStatus } from "@/types";
import { ApiError } from "@/lib/api";
import {
  approveOrderItem,
  deliverOrderItem,
  cancelOrderItem,
} from "@/services/orders";

// ---- মডার্ন inline SVG আইকন ----
export const Icon = {
  User: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Phone: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  ),
  Mail: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  MapPin: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Copy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      {...p}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  Truck: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M14 18V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1" />
      <path d="M15 18H9m10 0h1a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 16.52 8H14" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  X: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      {...p}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Trash: (p: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...p}
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
    </svg>
  ),
};

export function ItemStatusBadge({ status }: { status?: OrderItemStatus }) {
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

export function summaryStatus(items: OrderItem[]): OrderItemStatus {
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

// ✅ FIX: deliveryAddress অবজেক্ট (district/upazila/area/addressLine) থেকে
// একটা readable ঠিকানার স্ট্রিং বানানো — backend কখনো single "shippingAddress"
// স্ট্রিং পাঠায় না, তাই আগে এই অংশটা সবসময় খালি থাকত।
export function formatDeliveryAddress(addr?: Order["deliveryAddress"]) {
  if (!addr) return "";
  return [addr.addressLine, addr.area, addr.upazila, addr.district]
    .filter(Boolean)
    .join(", ");
}

// ---- অর্ডার কার্ড ----
export function OrderCard({
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

  // ✅ FIX: deliveryAddress.name/phone সবসময় থাকে (checkout এ required),
  // buyer.name/number account থেকে আসে (নাও থাকতে পারে)
  const recipientName =
    order.deliveryAddress?.name || order.buyer?.name || "অজানা ক্রেতা";
  const recipientPhone = order.deliveryAddress?.phone || order.buyer?.number;
  const address = formatDeliveryAddress(order.deliveryAddress);

  return (
    <button
      onClick={() => onOpen(order)}
      className="group flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#202A44]/10 bg-gradient-to-br from-white/80 to-white/60 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-[#F6F1E9]/10 dark:from-white/8 dark:to-white/4"
    >
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

      <div className="space-y-3 p-5">
        <div>
          <p className="text-sm font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            {recipientName}
          </p>
          {recipientPhone && (
            <p className="text-xs text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              📱 {recipientPhone}
            </p>
          )}
          {address && (
            <p className="line-clamp-1 text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
              📍 {address}
            </p>
          )}
        </div>

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

      <div className="border-t border-[#202A44]/10 px-5 py-2.5 text-center text-xs text-[#202A44]/50 transition group-hover:text-[#202A44] dark:border-[#F6F1E9]/10 dark:text-[#F6F1E9]/50 dark:group-hover:text-[#F6F1E9]">
        বিস্তারিত দেখুন →
      </div>
    </button>
  );
}

function ActionButton({
  onClick,
  disabled,
  variant,
  icon,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant: "primary" | "success" | "danger";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20",
    success:
      "bg-green-600 text-white hover:bg-green-700 shadow-sm shadow-green-600/20",
    danger:
      "border border-[#B1502F]/30 text-[#B1502F] hover:bg-[#B1502F]/5 dark:text-[#E2A227] dark:hover:bg-[#E2A227]/10",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {icon}
      {children}
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
            <ActionButton
              onClick={handleApprove}
              disabled={busy}
              variant="primary"
              icon={<Icon.Check width={15} height={15} />}
            >
              অ্যাপ্রুভ
            </ActionButton>
          )}
          <ActionButton
            onClick={handleDeliver}
            disabled={busy}
            variant="success"
            icon={<Icon.Truck width={15} height={15} />}
          >
            {showNoteInput
              ? busy
                ? "সেভ হচ্ছে..."
                : "নোটসহ ডেলিভারড"
              : "ডেলিভারড"}
          </ActionButton>
          <ActionButton
            onClick={handleCancel}
            disabled={busy}
            variant="danger"
            icon={<Icon.Trash width={15} height={15} />}
          >
            ডিলিট
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function BuyerInfoRow({
  icon,
  label,
  value,
  copyable,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  copyable?: boolean;
}) {
  const hasValue = Boolean(value && value.trim());
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/60 p-3 dark:bg-white/10">
      <div className="mt-0.5 rounded-lg bg-[#202A44]/10 p-1.5 text-[#202A44] dark:bg-white/10 dark:text-[#F6F1E9]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-[#202A44]/50 dark:text-[#F6F1E9]/50">
          {label}
        </p>
        <p
          className={`truncate text-sm font-medium ${
            hasValue
              ? "text-[#202A44] dark:text-[#F6F1E9]"
              : "text-[#202A44]/35 dark:text-[#F6F1E9]/35"
          }`}
        >
          {hasValue ? value : "প্রদান করা হয়নি"}
        </p>
      </div>
      {copyable && hasValue && (
        <button
          onClick={() => navigator.clipboard.writeText(value || "")}
          className="shrink-0 rounded-lg p-1.5 text-[#202A44]/40 transition hover:bg-[#202A44]/10 hover:text-[#202A44] dark:text-[#F6F1E9]/40 dark:hover:bg-white/10 dark:hover:text-[#F6F1E9]"
          aria-label="কপি করুন"
        >
          <Icon.Copy width={14} height={14} />
        </button>
      )}
    </div>
  );
}

export function OrderDetailsModal({
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
  const address = formatDeliveryAddress(order.deliveryAddress);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#F6F1E9] p-7 dark:bg-[#202A44]"
      >
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
            <Icon.X width={18} height={18} />
          </button>
        </div>

        {/* ✅ ডেলিভারি প্রাপক — checkout এ required, তাই সবসময় থাকার কথা */}
        <div className="mb-4 space-y-3 rounded-2xl border border-[#202A44]/10 bg-gradient-to-br from-[#E2A227]/10 to-transparent p-5 dark:border-[#F6F1E9]/10 dark:from-[#E2A227]/20">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            ডেলিভারি প্রাপকের তথ্য
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <BuyerInfoRow
              icon={<Icon.User width={16} height={16} />}
              label="নাম"
              value={order.deliveryAddress?.name}
            />
            <BuyerInfoRow
              icon={<Icon.Phone width={16} height={16} />}
              label="ফোন নম্বর"
              value={order.deliveryAddress?.phone}
              copyable
            />
            <BuyerInfoRow
              icon={<Icon.MapPin width={16} height={16} />}
              label="ঠিকানা"
              value={address}
            />
          </div>
        </div>

        {/* ✅ অ্যাকাউন্ট তথ্য — user কালেকশন থেকে (নাও থাকতে পারে সব ফিল্ড) */}
        <div className="mb-6 space-y-3 rounded-2xl border border-[#202A44]/10 p-5 dark:border-[#F6F1E9]/10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            ক্রেতার অ্যাকাউন্ট
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <BuyerInfoRow
              icon={<Icon.User width={16} height={16} />}
              label="অ্যাকাউন্ট নাম"
              value={order.buyer?.name}
            />
            <BuyerInfoRow
              icon={<Icon.Mail width={16} height={16} />}
              label="ইমেইল"
              value={order.buyer?.email}
              copyable
            />
          </div>
        </div>

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
