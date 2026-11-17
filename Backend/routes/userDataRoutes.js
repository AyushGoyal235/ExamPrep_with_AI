
const express = require("express");
const router = express.Router();

const StudentData = require("../models/StudentData");
const { protect } = require("../middleware/authMiddleware");

function createDefaultState(user) {
  return {
    profile: {
      name: user.name || "",
      goal: "Placement preparation",
      targetDate: "",
      hours: 2,
      level: "Beginner",
      language: "Java"
    },
    mastery: {
      Arrays: 0,
      Strings: 0,
      "Binary Search": 0,
      "Linked List": 0,
      "Dynamic Programming": 0,
      Graphs: 0
    },
    attempts: [],
    revision: [],
    tasks: [],
    planGenerated: false
  };
}

// GET: Load only the logged-in user's data
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    let studentData = await StudentData.findOne({ user: userId });

    if (!studentData) {
      try {
        studentData = await StudentData.create({
          user: userId,
          state: createDefaultState(req.user)
        });
      } catch (error) {
        // Handle simultaneous first-login requests
        if (error.code !== 11000) throw error;

        studentData = await StudentData.findOne({ user: userId });
      }
    }

    return res.status(200).json({
      success: true,
      data: studentData.state
    });

  } catch (error) {
    console.error("Load student data error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load student data."
    });
  }
});

// PUT: Save only the logged-in user's data
router.put("/", protect, async (req, res) => {
  try {
    const { state } = req.body;

    if (!state || typeof state !== "object" || Array.isArray(state)) {
      return res.status(400).json({
        success: false,
        message: "Valid student data is required."
      });
    }

    const studentData = await StudentData.findOneAndUpdate(
      { user: req.user._id },
      { $set: { state } },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Student data saved successfully.",
      data: studentData.state
    });

  } catch (error) {
    console.error("Save student data error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save student data."
    });
  }
});

module.exports = router;
