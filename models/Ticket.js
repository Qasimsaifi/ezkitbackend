const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
