
const express = require("express");
const Device = require("../models/Device");

const router = express.Router();

// Add a new device
router.post("/", async (req, res) => {
  try {
    const { deviceId, name, type, location } = req.body;

    if (!deviceId || !name || !type) {
      return res.status(400).json({
        success: false,
        message: "deviceId, name and type are required",
      });
    }

    const existingDevice = await Device.findOne({ deviceId });

    if (existingDevice) {
      return res.status(409).json({
        success: false,
        message: "Device ID already exists",
      });
    }

    const device = await Device.create({
      deviceId,
      name,
      type,
      location,
      status: "offline",
    });

    res.status(201).json({
      success: true,
      message: "Device added successfully",
      device,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all devices
router.get("/", async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: devices.length,
      devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get device by deviceId
router.get("/:deviceId", async (req, res) => {
  try {
    const device = await Device.findOne({
      deviceId: req.params.deviceId,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.json({
      success: true,
      device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
