const mongoose = require("mongoose");

const studentDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    state: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        profile: {
          name: "",
          goal: "Placement preparation",
          targetDate: "",
          hours: 2,
          level: "Intermediate"
        },
        mastery: {
          Arrays: 32,
          Strings: 25,
          "Binary Search": 20,
          "Linked List": 18,
          "Dynamic Programming": 12,
          Graphs: 10
        },
        attempts: [],
        revision: [],
        tasks: [],
        planGenerated: false
      })
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentData", studentDataSchema);
