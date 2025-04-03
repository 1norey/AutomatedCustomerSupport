// src/components/UserEditModal.js
import React from "react";

export default function UserEditModal({ user, editedData, setEditedData, onSave, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-[#1a1a2e] text-white rounded-lg p-6 w-full max-w-md shadow-2xl border border-[#A8DCAB]">
        <h3 className="text-xl font-bold mb-4 text-[#A8DCAB]">Edit User</h3>

        <div className="space-y-4">
          <input
            type="email"
            value={editedData.email}
            onChange={(e) => setEditedData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#519755]"
          />

          <select
            value={editedData.role}
            onChange={(e) => setEditedData((prev) => ({ ...prev, role: e.target.value }))}
            className="w-full px-4 py-2 rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#519755]"
          >
            <option value="client">Client</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded bg-[#DBAAA7] hover:bg-[#c99390] text-black font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
