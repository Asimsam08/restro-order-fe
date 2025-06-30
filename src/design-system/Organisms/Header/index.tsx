"use client";

import { useState } from "react";
import { LogOut, MapPin, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, username, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-700"> OrderEase</h1>

      <button
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6">
        {role === "customer" && (
          <Link
            href="/customer/track"
            className="text-gray-700 hover:text-blue-600 flex items-center gap-1"
          >
            <MapPin size={18} /> Track Orders
          </Link>
        )}
        <span className="flex items-center gap-1 text-gray-700">
          <User size={18} />
          {username}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 flex items-center gap-1"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <aside className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-6 animate-slide-in">
            <button
              className="self-end text-gray-600"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            {role === "customer" && (
              <Link
                href="/customer/track"
                onClick={() => setSidebarOpen(false)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <MapPin size={20} />
                Track Orders
              </Link>
            )}

            <span className="flex items-center gap-2 text-gray-800">
              <User size={20} /> {username}
            </span>

            <button
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
              className="bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </aside>
        </>
      )}
    </header>
  );
};

export default Header;
