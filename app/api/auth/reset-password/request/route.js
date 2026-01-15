import { NextRequest, NextResponse } from "next/server";
import { resetPasswordRequestSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = resetPasswordRequestSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, a password reset email has been sent" },
        { status: 200 }
      );
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, type: "password-reset" },
      process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Store token in database (you might want to create a PasswordResetToken model)
    // For now, we'll use JWT verification

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(
      { message: "If an account exists, a password reset email has been sent" },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
