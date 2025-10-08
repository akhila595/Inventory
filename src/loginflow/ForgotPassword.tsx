import React, { useState } from "react";
import { forgotPassword } from "@/loginflow/auth/authApi";

export default function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      setSuccess(response.data.message); // Use API response message directly
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "❌ Failed to send reset email");
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-96 mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your registered email"
          className="border p-2 w-full rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
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
