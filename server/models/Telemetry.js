
const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    sensorType: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Telemetry", telemetrySchema);
