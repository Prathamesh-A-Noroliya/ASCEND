import mongoose, { Schema, models } from "mongoose";

const QuestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    category: {
      type: String,
      enum: ["coding", "study", "fitness", "mindfulness", "creative", "social"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "epic"],
      default: "easy",
    },

    attribute: {
      type: String,
      enum: [
        "strength",
        "intellect",
        "discipline",
        "creativity",
        "charisma",
      ],
      required: true,
    },

    xpReward: {
      type: Number,
      required: true,
      min: 1,
    },

    goldReward: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "started", "completed"],
      default: "active",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Quest =
  models.Quest || mongoose.model("Quest", QuestSchema);