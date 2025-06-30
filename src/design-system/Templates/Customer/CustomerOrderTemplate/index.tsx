

"use client";
import MenuItemCard from "@/design-system/Melecules/MenuItemCard";
import api from "@/utils/api";
import { menuItems } from "@/utils/constant";
import React, { useState } from "react";
import { toast } from "react-toastify";



const CustomerOrderTemplate = () => {
  const [order, setOrder] = useState<{ id: number; quantity: number }[]>([]);

  const handleAddItem = (id: number) => {
    setOrder((prev) => {
      const exists = prev.find((item) => item.id === id);
      if (exists) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const handlePlaceOrder = async () => {
    try {
      const itemsWithPrice = order.map(({ id, quantity }) => {
        const item = menuItems.find((m) => m.id === id);
        return {
          id,
          quantity,
          price: item?.price || 0,
          name: item?.name || "",
        };
      });

      const response = await api.post("/orders", {
        items: itemsWithPrice,
      });

      toast.success("Order placed successfully!");
      console.log("Order response:", response.data);

      setOrder([]);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to place order.";
      toast.error(errorMessage);
      console.error("Order error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Choose from Our Menu
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <MenuItemCard
            key={item.id}
            name={item.name}
            price={item.price}
            onAdd={() => handleAddItem(item.id)}
          />
        ))}
      </div>

      {order.length > 0 && (
        <div className="mt-10 bg-gray-100 p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Your Order Summary
          </h3>

          <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
            {order.map(({ id, quantity }) => {
              const item = menuItems.find((m) => m.id === id);
              return (
                <li key={id} className="flex justify-between">
                  <span>
                    {item?.name} × {quantity}
                  </span>
                  <span>₹{(item?.price || 0) * quantity}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 text-right font-semibold text-lg text-green-700">
            Total: ₹
            {order.reduce((sum, { id, quantity }) => {
              const item = menuItems.find((m) => m.id === id);
              return sum + (item?.price || 0) * quantity;
            }, 0)}
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderTemplate;
