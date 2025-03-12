const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    enum: ["home", "work", "other"],
    default: "home",
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  landmark: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
    match: [/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian pincode"],
  },
  country: {
    type: String,
    default: "India",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    profilePicture: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    phoneNumber: {
      type: String,
      required: false,
      match: [
        /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
        "Please enter a valid Indian phone number",
      ],
    }, // Format for Indian phone numbers
    alternatePhoneNumber: {
      type: String,
      match: [
        /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
        "Please enter a valid Indian phone number",
      ],
    },
    addresses: [addressSchema],
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    googleId: { type: String },
    preferences: {
      newsletter: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
    },
    gstin: {
      type: String,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Please enter a valid GSTIN",
      ],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.addresses && this.addresses.length > 0) {
    const hasDefault = this.addresses.some((address) => address.isDefault);
    if (!hasDefault) {
      this.addresses[0].isDefault = true;
    }
  }

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
