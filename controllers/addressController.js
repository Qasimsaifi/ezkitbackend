const User = require("../models/User");

exports.getAllAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAddress = req.body;

    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses[user.addresses.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const updatedAddress = req.body;

    if (updatedAddress.isDefault && !address.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    Object.keys(updatedAddress).forEach((key) => {
      address[key] = updatedAddress[key];
    });

    await user.save();
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const wasDefault = address.isDefault;

    address.remove();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.equals(address._id);
    });

    await user.save();
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
