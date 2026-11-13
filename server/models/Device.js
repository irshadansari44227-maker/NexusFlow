const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    location: { type: String, default: "Not specified" },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
