import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionUserId } from "@/lib/session";
import { Quest } from "@/models/Quest";
import { Character } from "@/models/Character";
import { QuestCompletion } from "@/models/QuestCompletion";

function requiredXP(level: number) {
  return Math.floor(100 * Math.pow(1.35, level - 1));
}

function getTodayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await connectDB();

    const quest = await Quest.findOne({
      _id: id,
      userId,
    });

    if (!quest) {
      return NextResponse.json(
        { message: "Quest not found" },
        { status: 404 }
      );
    }

    if (quest.status === "completed") {
      return NextResponse.json(
        { message: "Quest has already been completed" },
        { status: 409 }
      );
    }

    const character = await Character.findOne({ userId });

    if (!character) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 }
      );
    }

    const existingCompletion = await QuestCompletion.findOne({
      userId,
      questId: quest._id,
    });

    if (existingCompletion) {
      return NextResponse.json(
        { message: "Quest has already been completed" },
        { status: 409 }
      );
    }

    const now = new Date();

    // Server-controlled rewards.
    const xpAwarded = quest.xpReward;
    const goldAwarded = quest.goldReward;

    character.xp += xpAwarded;
    character.gold += goldAwarded;

    // Increase the attribute associated with the quest.
    const attribute = quest.attribute as
      | "strength"
      | "intellect"
      | "discipline"
      | "creativity"
      | "charisma";

    character[attribute] += 1;

    // Update streak.
    const today = getTodayKey(now);

    if (character.lastActivityDate) {
      const previous = new Date(character.lastActivityDate);
      const previousDay = new Date(previous);
      previousDay.setUTCDate(previousDay.getUTCDate() - 1);

      if (getTodayKey(previous) === today) {
        // Already active today.
      } else if (getTodayKey(previousDay) === today) {
        character.currentStreak += 1;
      } else {
        character.currentStreak = 1;
      }
    } else {
      character.currentStreak = 1;
    }

    if (character.currentStreak > character.longestStreak) {
      character.longestStreak = character.currentStreak;
    }

    character.lastActivityDate = now;

    // Non-linear level progression.
    let levelsGained = 0;

    while (character.xp >= requiredXP(character.level)) {
      character.xp -= requiredXP(character.level);
      character.level += 1;
      levelsGained += 1;
    }

    quest.status = "completed";
    quest.completedAt = now;

    await QuestCompletion.create({
      userId,
      questId: quest._id,
      xpAwarded,
      goldAwarded,
      attributeAwarded: attribute,
      completedAt: now,
    });

    await quest.save();
    await character.save();

    return NextResponse.json({
      success: true,
      message:
        levelsGained > 0
          ? `Quest completed. Level up! You are now level ${character.level}.`
          : "Quest completed successfully.",
      rewards: {
        xp: xpAwarded,
        gold: goldAwarded,
        attribute,
      },
      level: {
        current: character.level,
        levelsGained,
        currentXP: character.xp,
        nextLevelXP: requiredXP(character.level),
      },
      character,
    });
  } catch (error) {
    console.error("Complete quest error:", error);

    return NextResponse.json(
      { message: "Failed to complete quest" },
      { status: 500 }
    );
  }
}