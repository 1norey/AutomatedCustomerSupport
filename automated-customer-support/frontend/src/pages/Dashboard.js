import React from "react";
import Sidebar from "../components/SideBar";
import TicketManager from "../components/TicketManager";
import UserManager from "../components/UserManager"; 

export default function Dashboard() {
  const role = JSON.parse(localStorage.getItem("user"))?.role || "user";

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-56 p-10 min-h-screen bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] text-white w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-[#A8DCAB] mb-2">
            🧠 Welcome {role === "admin" ? "Admin" : role === "agent" ? "Agent" : "User"}
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your workspace, view tickets, and control your customer support system.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12">
          <div className="bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-xl font-semibold mb-2">📨 Support Tickets</h2>
            <p className="text-gray-300">Create, edit, and resolve customer inquiries.</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-xl font-semibold mb-2">👥 Manage Users</h2>
            <p className="text-gray-300">View and manage platform users (Admin only).</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-xl font-semibold mb-2">📊 Chat Logs & Analytics</h2>
            <p className="text-gray-300">(Coming Soon) Visualize activity and performance data.</p>
          </div>
        </div>

        {/* Ticket Section */}
        <TicketManager />

        {/* User Management (Admin only) */}
        {role === "admin" && (
          <div className="mt-16">
            <UserManager />
          </div>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="mt-10 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
