const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "guest"],
      default: "local",
    },

    avatar: {
      type: String,
      default: "",
    },

    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    color: {
      type: String,
      enum: ["Amber", "Blue", "Pink", "Rose", "Emerald", "Black"],
      default: "Blue",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
