import { NextRequest, NextResponse } from "next/server";
import {
  ProfileUpdateError,
  updateUserProfile,
} from "@/server/db/user-profile";

export async function POST(request: NextRequest) {
  try {
    const payload = await request
      .json()
      .catch(() => ({})) as Record<string, unknown>;
    const updatedUser = updateUserProfile(payload);

    return NextResponse.json({
      status: "success",
      message: "Account updated",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof ProfileUpdateError) {
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
        },
        { status: error.statusCode }
      );
    }

    console.error("Profile update failed", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Unable to update account at this time",
      },
      { status: 500 }
    );
  }
}
