import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionUserId } from "@/lib/session";
import { Character } from "@/models/Character";

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in" },
        { status: 401 }
      );
    }

    await connectDB();

    const character = await Character.findOne({ userId }).lean();

    if (!character) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error("Get character error:", error);

    return NextResponse.json(
      { message: "Failed to load character" },
      { status: 500 }
    );
  }
}
