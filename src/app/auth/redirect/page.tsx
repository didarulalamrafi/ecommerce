"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRedirectPath } from "../../../lib/redirect-by-role";

export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleRedirect() {
      let userRole = "user";

      try {
        const sessionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/get-session`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          userRole = (sessionData?.user as any)?.role || "user";
        }
      } catch (err) {
        console.warn("Session fetch failed:", err);
      }

      const redirectPath = getRedirectPath(userRole);
      router.replace(redirectPath);
    }

    handleRedirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">লগইন হচ্ছে, একটু অপেক্ষা করুন...</p>
    </div>
  );
}
