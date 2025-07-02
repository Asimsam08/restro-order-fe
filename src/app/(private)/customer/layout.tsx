import ProtectedRoute from "@/design-system/Templates/ProtectedRoute";

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute allowedRole="customer">
      {children}
    </ProtectedRoute>
  );
};

export default CustomerLayout;
