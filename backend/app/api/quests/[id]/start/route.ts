import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionUserId } from "@/lib/session";
import { Quest } from "@/models/Quest";

export async function POST(
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
        { success: false, message: "Quest is already completed" },
        { status: 400 }
      );
    }

    quest.status = "started";
    await quest.save();

    return NextResponse.json({
      success: true,
      quest,
    });
  } catch (error) {
    console.error("Start quest error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to start quest" },
      { status: 500 }
    );
  }
}
