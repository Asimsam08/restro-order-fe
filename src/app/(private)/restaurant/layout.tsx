import ProtectedRoute from "@/design-system/Templates/ProtectedRoute";

const RestaurantLayout = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedRoute allowedRole="restaurant">{children}</ProtectedRoute>;
};

export default RestaurantLayout;
