import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, LogOut, LayoutDashboard, X } from "lucide-react";
import { debug } from "console";

interface UserData {
  name: string;
  role: string;
  email: string;
  phone: string;
  photo?: string;
}

type Section = "profile" | null;

export default function Sidebar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState<Section>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      window.location.href = "/";
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      setUser({
        name: parsed.name || "User Name",
        role: parsed.role || "User Role",
        email: parsed.email || "demo@example.com",
        phone: parsed.phone || "+91 9999999999",
        photo:
          parsed.photo ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      });
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-64 min-h-screen flex flex-col items-center justify-between
      bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#1e1b4b]
      backdrop-blur-lg text-white shadow-2xl border-r border-white/10
      p-6 rounded-r-3xl"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-4 w-full">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-2xl font-extrabold tracking-wide text-[#a5b4fc] flex items-center gap-2"
        >
          <LayoutDashboard className="w-6 h-6 text-[#60a5fa]" />
          Dashboard
        </motion.h1>

        {/* Navigation */}
        <ul className="space-y-3 mt-6 text-center w-full">
          <li
            className={`cursor-pointer flex items-center justify-center gap-2 py-2 rounded-xl transition-all
              ${
                activeSection === "profile"
                  ? "bg-white/20 text-[#93c5fd] font-semibold"
                  : "hover:bg-white/10 hover:text-[#bfdbfe]"
              }`}
            onClick={() =>
              setActiveSection(activeSection === "profile" ? null : "profile")
            }
          >
            <User className="w-4 h-4" />{" "}
            {activeSection === "profile" ? "Close Profile" : "Profile"}
          </li>
        </ul>

        {/* Profile Section */}
        {activeSection === "profile" && user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center bg-gradient-to-br 
            from-[#1e40af]/50 to-[#312e81]/50 backdrop-blur-lg
            border border-white/10 rounded-2xl p-5 mt-6 w-full text-center shadow-lg"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveSection(null)}
              className="absolute top-3 right-3 text-indigo-200 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={user.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-3 border-4 border-white/30 shadow-md object-cover"
            />
            <h2 className="text-lg font-semibold text-indigo-100">
              {user.name}
            </h2>
            <p className="text-sm text-indigo-200 mb-2">{user.role}</p>
            <p className="text-xs text-indigo-300">{user.email}</p>
            <p className="text-xs text-indigo-300 mb-4">{user.phone}</p>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2 
              bg-gradient-to-r from-red-500/90 to-pink-500/80 
              hover:from-red-600 hover:to-pink-600 text-white 
              rounded-lg shadow-md transition-all font-medium"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-indigo-200/70 mt-6 text-center">
        © {new Date().getFullYear()} <br />
        <span className="text-indigo-300 font-medium">Smart Dashboard</span>
      </div>
    </motion.aside>
  );
}
