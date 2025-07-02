"use client";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_API_ENDPOINT } from "@/utils/constant";
import ButtonSpinner from "@/design-system/Atoms/ButtonSpinner";

const SignUpTemplate = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLaoding] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering:", { email, password });

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLaoding(true);
      const response = await axios.post(`${BASE_API_ENDPOINT}/auth/register`, {
        name,
        email,
        password,
      });
      toast.success("Registration successful!");
      console.log("Registered user:", response.data);
      if (response.status === 201) {
        router.push("/login");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Registration failed.";
      toast.error(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLaoding(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Customer Registration</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            className="w-full border px-4 py-2 mb-3 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            // onClick={handleRegister}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <ButtonSpinner size={20} color="white" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpTemplate;
