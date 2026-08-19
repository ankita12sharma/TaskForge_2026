const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Backlog", "To Do", "Doing", "Completed", "On Hold"],
      default: "To Do",
    },

    priority: {
      type: String,
      enum: ["No Priority", "Low", "Medium", "High", "Urgent"],
      default: "No Priority",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    labels: [
      {
        type: String,
        trim: true,
      },
    ],

    startDate: {
      type: Date,
    },

    dueDate: {
      type: Date,
    },

    resources: [
      {
        type: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", taskSchema);
