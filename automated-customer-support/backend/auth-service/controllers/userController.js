// controllers/userController.js
const User = require("../models/User");


exports.getUsers = async (req, res) => {
  try {
    // ✅ Only allow admins
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.findAll({
      attributes: ["id", "email", "role"], // cleaner result
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
  
      const { role, email } = req.body;
  
      if (role && !["admin", "agent", "client"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      const updateData = {};
      if (role) updateData.role = role;
      if (email) updateData.email = email;
  
      await User.update(updateData, { where: { id: req.params.id } });
  
      res.json({ message: "User updated" });
    } catch (err) {
      res.status(500).json({ message: "Failed to update user", error: err.message });
    }
  };
  

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Optional: prevent admin from deleting their own account
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};
