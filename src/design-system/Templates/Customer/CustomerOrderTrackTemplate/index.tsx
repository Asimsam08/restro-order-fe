

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
