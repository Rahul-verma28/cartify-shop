import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import connectDB from "@/lib/mongoDB";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  const { token, password } = await request.json();

  // Validate input
  if (!token || !password) {
    return NextResponse.json(
      { message: "Token and password are required" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await connectDB();

    // Hash the token for comparison
    const resetPasswordTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find the user with the matching token and check if it's expired
    const user = await User.findOne({
      resetPasswordToken: resetPasswordTokenHash,
      resetPasswordExpires: { $gt: new Date() }, // Ensure token is not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in password reset:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
