"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ToastProvider from "./components/ToastProvider";

const tabs = [
  { name: "Add Products", href: "/seller/dashboard/add-products" },
  { name: "My Products", href: "/seller/dashboard/products" },
  { name: "My Orders", href: "/seller/dashboard/orders" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div>
        <div className="mx-auto max-w-7xl px-5 pt-6 md:px-8 lg:px-10">
          <div className="inline-flex gap-1 rounded-full border border-[#202A44]/10 p-1 dark:border-[#F6F1E9]/10">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href}>
                  <span
                    className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#202A44] text-[#F6F1E9] dark:bg-[#F6F1E9] dark:text-[#202A44]"
                        : "text-[#202A44]/60 hover:bg-[#202A44]/5 dark:text-[#F6F1E9]/60 dark:hover:bg-white/5"
                    }`}
                  >
                    {tab.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </ToastProvider>
  );
}
