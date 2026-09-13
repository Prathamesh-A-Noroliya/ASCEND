import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionUserId } from "@/lib/session";
import { Quest } from "@/models/Quest";

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in" },
        { status: 401 }
      );
    }

    await connectDB();

    await Quest.deleteMany({ userId });

    const quests = await Quest.insertMany([
      {
        userId,
        title: "DEEP WORK PROTOCOL",
        description: "Complete 45 minutes of uninterrupted coding or technical work.",
        category: "coding",
        difficulty: "hard",
        attribute: "intellect",
        xpReward: 180,
        goldReward: 75,
        status: "completed",
        completedAt: new Date(),
      },
      {
        userId,
        title: "IRON DISCIPLINE",
        description: "Complete a 30 minute workout or physical training session.",
        category: "fitness",
        difficulty: "medium",
        attribute: "strength",
        xpReward: 100,
        goldReward: 40,
        status: "completed",
        completedAt: new Date(),
      },
      {
        userId,
        title: "MIND CALIBRATION",
        description: "Complete 15 minutes of meditation or focused reflection.",
        category: "mindfulness",
        difficulty: "easy",
        attribute: "discipline",
        xpReward: 50,
        goldReward: 20,
        status: "started",
      },
      {
        userId,
        title: "KNOWLEDGE ASCENSION",
        description: "Study a new concept for 30 minutes and record three things you learned.",
        category: "study",
        difficulty: "medium",
        attribute: "intellect",
        xpReward: 100,
        goldReward: 40,
        status: "active",
      },
      {
        userId,
        title: "CREATIVE FORGE",
        description: "Spend 30 minutes creating something: writing, music, design, or art.",
        category: "creative",
        difficulty: "medium",
        attribute: "creativity",
        xpReward: 100,
        goldReward: 40,
        status: "active",
      }
    ]);

    return NextResponse.json({
      success: true,
      message: "Ascension quest board initialized",
      count: quests.length,
      quests,
    });
  } catch (error) {
    console.error("Bootstrap quests error:", error);

    return NextResponse.json(
      { message: "Failed to initialize quest board" },
      { status: 500 }
    );
  }
}
