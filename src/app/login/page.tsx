"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginTemplate from "@/design-system/Templates/LoginTemplate";
import { useAuthStore } from "@/store/useAuthStore";


const LoginPage = () => {
  const { token, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token && role) {
      router.replace(role === "restaurant" ? "/restaurant" : "/customer/order");
    }
  }, [token, role]);

  return <LoginTemplate />;
};

export default LoginPage;
