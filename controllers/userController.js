const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const {
    name,
    phoneNumber,
    profilePicture,
    address,
    dateOfBirth,
    gender,
    password,
    preferences,
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profilePicture) user.profilePicture = profilePicture;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (password) user.password = password; // Will be hashed by pre-save hook
    if (preferences) user.preferences = preferences;

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params; // User ID to delete
  try {
    // Allow self-delete or admin-only delete
    if (req.user.id !== id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this user" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
