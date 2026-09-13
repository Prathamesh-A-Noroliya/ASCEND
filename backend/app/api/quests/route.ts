import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionUserId } from "@/lib/session";
import { Quest } from "@/models/Quest";

const allowedCategories = [
  "coding",
  "study",
  "fitness",
  "mindfulness",
  "creative",
  "social",
];

const allowedDifficulties = ["easy", "medium", "hard", "epic"];

function getAttribute(category: string) {
  if (category === "coding" || category === "study") return "intellect";
  if (category === "fitness") return "strength";
  if (category === "mindfulness") return "discipline";
  if (category === "creative") return "creativity";
  return "charisma";
}

function getRewards(difficulty: string) {
  const rewards: Record<string, { xp: number; gold: number }> = {
    easy: { xp: 50, gold: 20 },
    medium: { xp: 100, gold: 40 },
    hard: { xp: 180, gold: 75 },
    epic: { xp: 300, gold: 125 },
  };

  return rewards[difficulty] || rewards.easy;
}

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "You must be logged in" },
        { status: 401 }
      );
    }

    await connectDB();

    const quests = await Quest.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      quests,
    });
  } catch (error) {
    console.error("Get quests error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load quests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "You must be logged in" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const category = String(body.category || "").toLowerCase();
    const difficulty = String(body.difficulty || "easy").toLowerCase();

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: "Invalid category" },
        { status: 400 }
      );
    }

    if (!allowedDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { success: false, message: "Invalid difficulty" },
        { status: 400 }
      );
    }

    const reward = getRewards(difficulty);

    await connectDB();

    const quest = await Quest.create({
      userId,
      title,
      description,
      category,
      difficulty,
      attribute: getAttribute(category),
      xpReward: reward.xp,
      goldReward: reward.gold,
      status: "active",
    });

    return NextResponse.json(
      {
        success: true,
        quest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create quest error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create quest" },
      { status: 500 }
    );
  }
}
