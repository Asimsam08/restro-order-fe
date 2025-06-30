"use client"
import Header from "@/design-system/Organisms/Header";
import ProtectedRoute from "@/design-system/Templates/ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
    const { role } = useAuthStore()
  return <ProtectedRoute allowedRole={role ?? "customer"}>
    <Header />
    {children}</ProtectedRoute>;
};

export default PrivateLayout;
