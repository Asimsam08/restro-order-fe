// components/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/design-system/Atoms/LoadingSpinner";

export default function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: "customer" | "restaurant";
}) {
  const { token, role, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.replace("/login");
    } else if (role !== allowedRole) {
      const redirectTo =
        role === "customer" ? "/customer/order" : "/restaurant/dashboard";
      router.replace(redirectTo);
    } else {
      setCheckingAuth(false);
    }
  }, [token, role, hasHydrated, allowedRole]);

  if (checkingAuth || !hasHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
