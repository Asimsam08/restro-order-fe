"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_API_ENDPOINT } from "@/utils/constant";

const LoginTemplate = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLaoding] = useState<boolean>(false)
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLaoding(true)
      const response = await axios.post(
        `${BASE_API_ENDPOINT}/auth/login`,
        {
          email,
          password,
        }
      );

      const { token, role, email: userEmail, name, userId } = response.data;

      login({ token, role, userEmail, username: name, userId });

      toast.success("Logged in Successfully");

      if (role === "restaurant") {
        router.push("/restaurant/dashboard");
      } else {
        router.push("/customer/home");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Registration failed.";
      toast.error(errorMessage);
      console.error("Registration error:", err);
    }finally {
          setLaoding(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md min-h-[330px]">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
           {loading ? "Logging In" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginTemplate;
