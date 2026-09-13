import mongoose, { Schema, models } from "mongoose";

const QuestCompletionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questId: {
      type: Schema.Types.ObjectId,
      ref: "Quest",
      required: true,
      index: true,
    },
    xpAwarded: {
      type: Number,
      required: true,
      min: 0,
    },
    goldAwarded: {
      type: Number,
      required: true,
      min: 0,
    },
    attributeAwarded: {
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
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

QuestCompletionSchema.index(
  { userId: 1, questId: 1 },
  { unique: true }
);

export const QuestCompletion =
  models.QuestCompletion ||
  mongoose.model("QuestCompletion", QuestCompletionSchema);