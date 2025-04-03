import React, { useEffect, useState } from "react";
import api from "../api/authApi";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedData, setEditedData] = useState({ email: "", role: "client" });
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "client" });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      setError("Failed to load users.");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedData({ email: user.email, role: user.role });
    setModalOpen(true);
  };

  const updateUser = async () => {
    try {
      await api.put(`/users/${selectedUser.id}`, editedData);
      setModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      alert("Failed to update user.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user.");
    }
  };

  const handleCreate = async () => {
    if (!newUser.email || !newUser.password) return alert("Fill in all fields.");
    try {
      await api.post("/auth/signup", newUser);
      setNewUser({ email: "", password: "", role: "client" });
      fetchUsers();
    } catch {
      alert("Failed to create user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/20 shadow-md relative z-10">
      <h2 className="text-2xl font-bold text-[#A8DCAB] mb-4">User Management</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Create new user */}
      <div className="mb-6 space-y-2">
        <input
          type="email"
          placeholder="New user's email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="px-3 py-2 rounded bg-white/10 text-white w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="px-3 py-2 rounded bg-white/10 text-white w-full"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="px-3 py-2 rounded bg-white/10 text-white w-full"
        >
          <option value="client">Client</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleCreate}
          className="mt-2 px-4 py-2 bg-[#DBAAA7] text-black font-semibold rounded hover:bg-[#c99390]"
        >
          Create User
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white">
          <thead className="text-[#A8DCAB] border-b border-white/20">
            <tr>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/10">
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-yellow-400 hover:text-yellow-600 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-400 hover:text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup for Editing */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1a1a2e] rounded-lg p-6 shadow-xl border border-white/20 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#A8DCAB] mb-4">Edit User</h3>

            <input
              value={editedData.email}
              onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
              className="w-full mb-3 px-4 py-2 rounded bg-white/10 text-white"
              placeholder="Email"
            />
            <select
              value={editedData.role}
              onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
              className="w-full mb-4 px-4 py-2 rounded bg-white/10 text-white"
            >
              <option value="client">Client</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                className="px-4 py-2 bg-[#DBAAA7] text-black rounded hover:bg-[#c99390]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
