import mongoose, { Schema, models } from "mongoose";

const CharacterSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },

    xp: {
      type: Number,
      default: 0,
      min: 0,
    },

    gold: {
      type: Number,
      default: 0,
      min: 0,
    },

    strength: {
      type: Number,
      default: 1,
      min: 1,
    },

    intellect: {
      type: Number,
      default: 1,
      min: 1,
    },

    discipline: {
      type: Number,
      default: 1,
      min: 1,
    },

    creativity: {
      type: Number,
      default: 1,
      min: 1,
    },

    charisma: {
      type: Number,
      default: 1,
      min: 1,
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastActivityDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Character =
  models.Character || mongoose.model("Character", CharacterSchema);