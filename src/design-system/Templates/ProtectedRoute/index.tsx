// components/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Progress } from "@radix-ui/react-progress";
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
      router.replace("/");
    } else {
      setCheckingAuth(false); 
    }
  }, [token, role, hasHydrated]);

  if (checkingAuth || !hasHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <p className="text-lg font-semibold">Loading...</p> */}
        {/* <Progress value={33} /> */}
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
