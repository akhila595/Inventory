import React, { useState } from "react";
import { registerUser } from "@/loginflow/auth/authApi";

export default function Register({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await registerUser({ email, password });
      setSuccess(response.data.message); // Use API response message directly
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "❌ Registration failed");
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-96 mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <button
        onClick={onBack}
        className="mt-4 text-blue-500 hover:underline w-full text-center"
      >
        Back to Login
      </button>
    </div>
  );
}
