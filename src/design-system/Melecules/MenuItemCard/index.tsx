"use client";
import React from "react";

interface MenuItemCardProps {
  name: string;
  price: number;
  onAdd: () => void;
}

const MenuItemCard = ({ name, price, onAdd }: MenuItemCardProps) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">₹{price}</p>
      </div>
      <button
        onClick={onAdd}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add
      </button>
    </div>
  );
};

export default MenuItemCard;
