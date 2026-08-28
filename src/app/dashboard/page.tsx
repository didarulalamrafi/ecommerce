"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, Store } from "lucide-react";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import CartTab from "./CardTab";

type Tab = "profile" | "orders" | "cart";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "প্রোফাইল" },
  { id: "orders", label: "অর্ডার হিস্টরি" },
  { id: "cart", label: "কার্ট" },
];

function isValidTab(value: string | null): value is Tab {
  return value === "profile" || value === "orders" || value === "cart";
}

// ✅ FIX: useSearchParams() ব্যবহার করা সব লজিক এখন এই child
// component-এ, যেটা নিচে <Suspense> দিয়ে wrap করা হয়েছে।
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tab>(
    isValidTab(tabParam) ? tabParam : "profile",
  );

  const isCartOnly = activeTab === "cart";
  const isSeller = session?.user?.role === "seller";

  useEffect(() => {
    const nextTab: Tab = isValidTab(tabParam) ? tabParam : "profile";
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [tabParam]);

  function selectTab(tab: Tab) {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  }

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  async function handleLogout() {
    await signOut({});
    router.push("/login");
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
          লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (isCartOnly) {
    return (
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-5 sm:py-10 md:px-8">
        <CartTab />
      </div>
    );
  }

  // ---- স্বাভাবিক ড্যাশবোর্ড ভিউ (প্রোফাইল / অর্ডার হিস্টরি) ----
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      {/* 🆕 হেডার রো: টাইটেল বামে, লগআউট আইকন ডানে — সব স্ক্রিন সাইজে ফিক্সড, স্ক্রলে যাবে না */}
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[#202A44] dark:text-[#F6F1E9] sm:text-3xl">
          ড্যাশবোর্ড
        </h1>
        <button
          onClick={handleLogout}
          title="লগআউট"
          aria-label="লগআউট"
          className="flex shrink-0 items-center justify-center rounded-full border border-[#B1502F]/20 p-2.5 text-[#B1502F] transition-colors hover:bg-[#B1502F]/10 dark:border-[#E2A227]/30 dark:text-[#E2A227] dark:hover:bg-[#E2A227]/10"
        >
          <LogOut size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <nav
            className="
              -mx-5 flex gap-2 overflow-x-auto px-5 pb-1
              [-ms-overflow-style:none] [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              snap-x snap-mandatory
              md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0 md:snap-none
            "
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => selectTab(tab.id)}
                className={`shrink-0 snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors md:rounded-xl ${
                  activeTab === tab.id
                    ? "bg-[#202A44] text-[#F6F1E9] dark:bg-[#F6F1E9] dark:text-[#202A44]"
                    : "bg-[#202A44]/5 text-[#202A44] hover:bg-[#202A44]/10 dark:bg-white/5 dark:text-[#F6F1E9] dark:hover:bg-white/10 md:bg-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* শুধু সেলারদের জন্য দেখাবে */}
            {isSeller && (
              <Link
                href="/seller/dashboard/products"
                className="flex shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full bg-[#202A44]/5 px-4 py-2 text-sm font-medium text-[#202A44] transition-colors hover:bg-[#202A44]/10 dark:bg-white/5 dark:text-[#F6F1E9] dark:hover:bg-white/10 md:mt-4 md:rounded-xl md:bg-transparent"
              >
                <Store size={15} strokeWidth={2} />
                সেলার ড্যাশবোর্ড
              </Link>
            )}
          </nav>
        </aside>

        {/* Active tab content */}
        <section className="flex-1">
          {activeTab === "profile" && session.user && (
            <ProfileTab user={session.user} />
          )}
          {activeTab === "orders" && <OrdersTab />}
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
          <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            লোড হচ্ছে...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
