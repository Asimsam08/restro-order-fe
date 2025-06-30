// "use client";
// import React, { useEffect, useState } from "react";

// const mockOrder = {
//   id: 123,
//   items: ["Paneer Tikka", "Veg Biryani"],
//   status: "Preparing",
// };

// const statusFlow = ["Pending", "Confirmed", "Preparing", "Ready", "Delivered"];

// const CustomerTrackPage = () => {
//   const [status, setStatus] = useState(mockOrder.status);

//   // Simulate live update (replace with WebSocket later)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setStatus((prev) => {
//         const idx = statusFlow.indexOf(prev);
//         return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : prev;
//       });
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-2">Track Your Order</h2>
//       <p className="mb-4 text-gray-700">Order ID: #{mockOrder.id}</p>
//       <ul className="space-y-2">
//         {statusFlow.map((step) => (
//           <li
//             key={step}
//             className={`p-3 rounded border ${
//               statusFlow.indexOf(step) <= statusFlow.indexOf(status)
//                 ? "bg-green-100 border-green-500"
//                 : "bg-gray-100 border-gray-300"
//             }`}
//           >
//             {step}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CustomerTrackPage;

"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import socket from "@/utils/socket";
import { toast } from "react-toastify";

const statusFlow = ["pending", "confirmed", "preparing", "ready", "delivered"];

interface Order {
  id: number;
  items: { name: string; quantity: number }[];
  status: string;
  created_at: string;
}

const CustomerTrackPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, userId, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO");
    });

    socket.on("orderStatusUpdated", (data) => {
      console.log("Order status update received:", data);
      // You can update your state here based on new order status
    });

    return () => {
      socket.off("orderStatusUpdated");
      socket.disconnect();
    };
  }, []);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  // useEffect(() => {
  //   console.log("Joining room:", `customer-${userId}`);

  //   if (!token || !userId) return;

  //   // if (token && userId) {
  //   //   socket.emit("joinRoom", `customer-${userId}`);
  //   // }

  //   socket.emit("joinRoom", `customer-${userId}`);

  //   socket.on("orderStatusUpdated", (updatedOrder) => {
  //     console.log("Order status update received:", updatedOrder);
  //     toast.info("Order status update received");

  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order.id === updatedOrder.id ? updatedOrder : order
  //       )
  //     );
  //   });

  //   return () => {
  //     socket.off("orderStatusUpdated");
  //   };
  // }, [token, userId]);

  useEffect(() => {
    if (!hasHydrated || !token || !userId) return;

    socket.connect();

    socket.on("connect", () => {
      const room = `customer-${userId}`;
      console.log("Joining room:", room);
      socket.emit("joinRoom", room);
    });

    socket.on("orderStatusUpdated", (updatedOrder) => {
      console.log("Order status update received:", updatedOrder);
      toast.info("Order status update received");
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off("orderStatusUpdated");
      socket.disconnect();
    };
  }, [hasHydrated, token, userId]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading orders...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => router.push("/customer/order")}
        className="cursor-pointer mb-6 flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeft className="mr-1" size={18} />
        Back to Order Page
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center">Track Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="mb-8 border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="mb-2 text-sm text-gray-600">
              <strong>Order ID:</strong> #{order.id} •{" "}
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="mb-3">
              <strong>Items:</strong>
              <ul className="ml-4 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 mt-4">
              {/* {statusFlow.map((step) => (
                <div
                  key={step}
                  className={`px-3 py-2 rounded text-sm ${
                    statusFlow.indexOf(step) <=
                    statusFlow.indexOf(order.status)
                      ? "bg-green-100 text-green-800 font-semibold"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </div>
              ))} */}
              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-2 rounded text-sm font-semibold ${
                    order.status === "pending"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  Current Status:{" "}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerTrackPage;
