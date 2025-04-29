const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { isActive: true } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// PUT update role (admin only)
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["client", "agent", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating role", error: err.message });
  }
};

// DELETE soft delete (admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: "User soft-deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

// PUT self-update (only email/password)
exports.updateSelf = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: "Profile updated", user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};
