// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";

interface User {
  name: string;
  role: string;
  email: string;
  phone: string;
  photo?: string;
}

type Section = "profile" | null;

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<Section>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      window.location.href = "/"; // redirect if not logged in
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      setUser({
        name: parsed.name || "User Name",
        role: parsed.role || "User Role",
        email: parsed.email || "demo@example.com",
        phone: parsed.phone || "+91 9999999999",
        photo: parsed.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png", // default avatar
      });
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/"; // redirect to login
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 via-purple-700 to-pink-700 text-white p-6 shadow-xl h-screen flex flex-col items-center">
      <h1 className="text-2xl font-extrabold mb-8 tracking-wide flex items-center gap-2">
        📊 Dashboard
      </h1>

      <ul className="space-y-4 mb-8 w-full text-center">
        <li
          className={`cursor-pointer hover:text-pink-300 ${
            activeSection === "profile" ? "underline font-semibold" : ""
          }`}
          onClick={() => setActiveSection("profile")}
        >
          👤 Profile
        </li>
      </ul>

      {/* Profile Section */}
      {activeSection === "profile" && user && (
        <div className="flex flex-col items-center bg-white/10 rounded-2xl p-6 w-full text-center">
          <img
            src={user.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 border-4 border-white/30 shadow-md"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm opacity-80 mb-4">{user.role}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all"
          >
            Logout
          </button>
        </div>
      )}

      <div className="mt-auto text-sm opacity-70 text-center">
        © {new Date().getFullYear()} Dashboard
      </div>
    </aside>
  );
}
