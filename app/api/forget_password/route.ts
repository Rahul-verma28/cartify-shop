import User from "@/lib/models/User";
import connectDB from "@/lib/mongoDB";
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenHash = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');
    const resetPasswordTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetPasswordTokenHash;
    user.resetPasswordExpires = resetPasswordTokenExpires;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetPasswordToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Improved HTML email for better UI
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; padding: 32px;">
        <div style="text-align:center;">
          <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Reset Password" width="64" style="margin-bottom: 16px;" />
          <h2 style="color: #2563eb; margin-bottom: 8px;">Reset Your Password</h2>
        </div>
        <p style="color: #334155; font-size: 16px; margin-bottom: 24px;">
          Hi <b>${user.name || user.email}</b>,
        </p>
        <p style="color: #334155; font-size: 15px; margin-bottom: 24px;">
          We received a request to reset your password for your CartifyShop account. Click the button below to set a new password. This link will expire in 1 hour.
        </p>
        <div style="text-align:center; margin-bottom: 32px;">
          <a href="${resetUrl}" style="display:inline-block; background:#2563eb; color:#fff; font-weight:600; padding:12px 32px; border-radius:6px; text-decoration:none; font-size:16px;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
          If you did not request a password reset, you can safely ignore this email.<br/>
          For security, never share your password with anyone.
        </p>
        <hr style="margin:32px 0; border:none; border-top:1px solid #e2e8f0;" />
        <div style="text-align:center; color:#94a3b8; font-size:12px;">
          &copy; ${new Date().getFullYear()} CartifyShop. All rights reserved.
        </div>
      </div>
    `;

    await transporter.sendMail({
      to: user.email,
      subject: "Reset your CartifyShop password",
      html,
      text: `Hi ${user.name || user.email},\n\nWe received a request to reset your password for your CartifyShop account.\n\nReset your password: ${resetUrl}\n\nIf you did not request this, you can ignore this email.\n\n- CartifyShop`
    });

    return NextResponse.json({ message: "Reset password email sent" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}