

"use client";
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";
import socket from "@/utils/socket";

const statusFlow = ["pending", "confirmed", "preparing", "ready", "delivered"];

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err: any) {
      toast.error("Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.emit("joinRoom", "restaurant-room");

    socket.on("newOrderPlaced", (order) => {
      toast.info("New order received!");
      setOrders((prev) => [order, ...prev]);
    });

    return () => {
      socket.off("newOrderPlaced");
    };
  }, []);

  

  const updateStatus = (orderId: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleSave = async (orderId: number, status: string) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, { status });
      toast.success(`Order #${orderId} updated to: ${response.data.status}`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update status.";
      toast.error(errorMessage);
      console.error("Status update error:", err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading orders...</div>;
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Restaurant Orders Dashboard
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white"
            >
              <div className="space-y-1 w-full">
                <h3 className="font-bold text-lg text-gray-800">
                  Order #{order.id}
                </h3>
                <p className="text-sm text-gray-600">
                  Customer: {order.customer_name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Items:{" "}
                  {(Array.isArray(order.items)
                    ? order.items.map((i: { name: any }) => i.name).join(", ")
                    : JSON.parse(order.items || "[]")
                        .map((i: any) => i.name)
                        .join(", ")) || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Current Status:{" "}
                  <span className="font-medium text-blue-600">
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border px-3 py-2 rounded w-full sm:w-auto"
                >
                  {statusFlow.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleSave(order.id, order.status)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
