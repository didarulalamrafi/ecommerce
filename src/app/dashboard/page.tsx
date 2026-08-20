"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
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

  useEffect(() => {
    if (isValidTab(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

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

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl text-[#202A44] dark:text-[#F6F1E9]">
        ড্যাশবোর্ড
      </h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => selectTab(tab.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#202A44] text-[#F6F1E9] dark:bg-[#F6F1E9] dark:text-[#202A44]"
                    : "text-[#202A44] hover:bg-[#202A44]/5 dark:text-[#F6F1E9] dark:hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium text-[#B1502F] transition-colors hover:bg-[#B1502F]/10 dark:text-[#E2A227] md:mt-4"
            >
              লগআউট
            </button>
          </nav>
        </aside>

        {/* Active tab content */}
        <section className="flex-1">
          {activeTab === "profile" && session.user && (
            <ProfileTab user={session.user} />
          )}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "cart" && <CartTab />}
        </section>
      </div>
    </div>
  );
}

// ✅ FIX: এই বাইরের default export-টাই page হিসেবে কাজ করবে,
// আর ভেতরের useSearchParams-নির্ভর অংশ Suspense এর মধ্যে থাকবে।
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
