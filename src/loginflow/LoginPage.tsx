import React, { useState } from "react";
import { loginUser } from "@/loginflow/auth/authApi";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/app");
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "❌ Invalid email or password");
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (view === "register") {
    return <Register onBack={() => setView("login")} />;
  }

  if (view === "forgot") {
    return <ForgotPassword onBack={() => setView("login")} />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <button
            type="button"
            onClick={() => setView("register")}
            className="text-blue-500 hover:underline"
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setView("forgot")}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
}
