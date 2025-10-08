import React, { useEffect, useState } from "react";

// Define user type
interface User {
  name: string;
  role: string;
  email: string;
  phone: string;
}

// Define section type for navigation
type Section = "profile" | "settings" | null;

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<Section>(null);

  // Default API call (mock)
  useEffect(() => {
    fetch("/api/user") // Replace with real backend later
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => {
        // fallback demo data
        setUser({
          name: "Akhila R",
          role: "Java Developer",
          email: "akhila@example.com",
          phone: "+91 9876543210",
        });
      });
  }, []);

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 via-purple-700 to-pink-700 text-white p-6 shadow-xl h-screen flex flex-col">
      {/* App Title */}
      <h1 className="text-2xl font-extrabold mb-8 tracking-wide flex items-center gap-2">
        📊 Dashboard
      </h1>

      {/* User Info */}
      {user && (
        <div className="mb-8 p-4 bg-white/10 rounded-xl">
          <p className="text-lg font-semibold">👋 Hi, {user.name}</p>
          <p className="text-sm opacity-80">{user.role}</p>
        </div>
      )}

      {/* Navigation Menu */}
      <ul className="space-y-4 flex-1">
        <li
          className={`cursor-pointer hover:text-purple-300 ${
            activeSection === "profile" ? "underline" : ""
          }`}
          onClick={() => setActiveSection("profile")}
        >
          👤 Profile
        </li>
        <li
          className={`cursor-pointer hover:text-pink-300 ${
            activeSection === "settings" ? "underline" : ""
          }`}
          onClick={() => setActiveSection("settings")}
        >
          ⚙️ Settings
        </li>
      </ul>

      {/* Content Section */}
      <div className="bg-white/10 text-sm p-4 mt-4 rounded-lg">
        {activeSection === "profile" && (
          <div>
            <h2 className="font-semibold mb-2">👤 Edit Profile</h2>
            <ul className="space-y-1 list-disc list-inside">
              <li>Update Phone: {user?.phone}</li>
              <li>Update Email: {user?.email}</li>
              <li>Change Password</li>
              <li>Logout</li>
            </ul>
          </div>
        )}

        {activeSection === "settings" && (
          <div>
            <h2 className="font-semibold mb-2">⚙️ Account Settings</h2>
            <ul className="space-y-1 list-disc list-inside">
              <li>Email Alerts: ON/OFF</li>
              <li>Low Stock Alerts: ON/OFF</li>
              <li>Sales Reports: ON/OFF</li>
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto text-sm opacity-70">
        © {new Date().getFullYear()} Dashboard
      </div>
    </aside>
  );
}
