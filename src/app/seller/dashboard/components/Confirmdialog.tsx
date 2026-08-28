"use client";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "নিশ্চিত করুন",
  cancelLabel = "বাতিল",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-[#F6F1E9] p-6 shadow-2xl dark:bg-[#202A44]"
      >
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            danger
              ? "bg-[#B1502F]/10 text-[#B1502F]"
              : "bg-[#202A44]/10 text-[#202A44] dark:bg-white/10 dark:text-[#F6F1E9]"
          }`}
        >
          {danger ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="22"
              height="22"
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="22"
              height="22"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          )}
        </div>

        <h3 className="mb-1 text-center text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
          {title}
        </h3>
        {description && (
          <p className="mb-5 text-center text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            {description}
          </p>
        )}
        {!description && <div className="mb-5" />}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-[#202A44]/20 py-2.5 text-sm font-medium text-[#202A44] transition hover:bg-[#202A44]/5 dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9] dark:hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-full py-2.5 text-sm font-medium text-white transition ${
              danger
                ? "bg-[#B1502F] hover:bg-[#B1502F]/90"
                : "bg-[#202A44] hover:opacity-90 dark:bg-[#F6F1E9] dark:text-[#202A44]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
