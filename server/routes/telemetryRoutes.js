
const express = require("express");
const Telemetry = require("../models/Telemetry");
const Device = require("../models/Device");

const router = express.Router();

// Add new telemetry reading
router.post("/", async (req, res) => {
  try {
    const { deviceId, sensorType, value, unit } = req.body;

    if (
      !deviceId ||
      !sensorType ||
      value === undefined ||
      value === null ||
      !unit
    ) {
      return res.status(400).json({
        success: false,
        message: "deviceId, sensorType, value and unit are required",
      });
    }

    if (typeof value !== "number" || !Number.isFinite(value)) {
      return res.status(400).json({
        success: false,
        message: "Telemetry value must be a valid number",
      });
    }

    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    const telemetry = await Telemetry.create({
      deviceId,
      sensorType,
      value,
      unit,
    });

    res.status(201).json({
      success: true,
      message: "Telemetry saved successfully",
      telemetry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all telemetry readings
router.get("/", async (req, res) => {
  try {
    const telemetry = await Telemetry.find()
      .sort({ recordedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: telemetry.length,
      telemetry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get telemetry readings for a specific device
router.get("/:deviceId", async (req, res) => {
  try {
    const telemetry = await Telemetry.find({
      deviceId: req.params.deviceId,
    })
      .sort({ recordedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      deviceId: req.params.deviceId,
      count: telemetry.length,
      telemetry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
