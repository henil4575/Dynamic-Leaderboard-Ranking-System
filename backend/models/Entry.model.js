const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: 0,
    },
    rank: {
      type: Number,
      default: null,
    },
    percentileRank: {
      type: Number,
      default: null, 
    },
    scoreHistory: {
      type: [Number],
      default: [], 
    },
    velocity: {
      type: Number,
      default: 0, 
    },
    submissionCount: {
      type: Number,
      default: 1,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    tag: {
      type: String,
      default: "Player", 
    },
    lastSubmittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
  
);

module.exports = mongoose.model("Entry", entrySchema);