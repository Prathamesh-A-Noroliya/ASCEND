import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionUserId } from "@/lib/session";
import { Quest } from "@/models/Quest";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    const quest = await Quest.findOne({
      _id: id,
      userId,
    });

    if (!quest) {
      return NextResponse.json(
        { success: false, message: "Quest not found" },
        { status: 404 }
      );
    }

    if (quest.status === "completed") {
      return NextResponse.json(
        { success: false, message: "Completed quests cannot be edited" },
        { status: 400 }
      );
    }

    if (body.title !== undefined) {
      const title = String(body.title).trim();

      if (!title) {
        return NextResponse.json(
          { success: false, message: "Title cannot be empty" },
          { status: 400 }
        );
      }

      quest.title = title;
    }

    if (body.description !== undefined) {
      quest.description = String(body.description).trim();
    }

    if (body.category !== undefined) {
      const category = String(body.category).toLowerCase();

      if (
        ![
          "coding",
          "study",
          "fitness",
          "mindfulness",
          "creative",
          "social",
        ].includes(category)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid category" },
          { status: 400 }
        );
      }

      quest.category = category;

      if (category === "coding" || category === "study")
        quest.attribute = "intellect";
      else if (category === "fitness")
        quest.attribute = "strength";
      else if (category === "mindfulness")
        quest.attribute = "discipline";
      else if (category === "creative")
        quest.attribute = "creativity";
      else quest.attribute = "charisma";
    }

    if (body.difficulty !== undefined) {
      const difficulty = String(body.difficulty).toLowerCase();

      const rewards: Record<string, { xp: number; gold: number }> = {
        easy: { xp: 50, gold: 20 },
        medium: { xp: 100, gold: 40 },
        hard: { xp: 180, gold: 75 },
        epic: { xp: 300, gold: 125 },
      };

      if (!rewards[difficulty]) {
        return NextResponse.json(
          { success: false, message: "Invalid difficulty" },
          { status: 400 }
        );
      }

      quest.difficulty = difficulty;
      quest.xpReward = rewards[difficulty].xp;
      quest.goldReward = rewards[difficulty].gold;
    }

    await quest.save();

    return NextResponse.json({
      success: true,
      quest,
    });
  } catch (error) {
    console.error("Update quest error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update quest" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const quest = await Quest.findOne({
      _id: id,
      userId,
    });

    if (!quest) {
      return NextResponse.json(
        { success: false, message: "Quest not found" },
        { status: 404 }
      );
    }

    if (quest.status === "completed") {
      return NextResponse.json(
        { success: false, message: "Completed quests cannot be deleted" },
        { status: 400 }
      );
    }

    await Quest.deleteOne({
      _id: id,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: "Quest deleted",
    });
  } catch (error) {
    console.error("Delete quest error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete quest" },
      { status: 500 }
    );
  }
}
