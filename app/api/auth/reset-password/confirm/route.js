import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations";
import { hashPassword, checkPasswordHistory, savePasswordHistory } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "secret"
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (decoded.type !== "password-reset") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check password history
    const isNewPassword = await checkPasswordHistory(user.id, password);
    if (!isNewPassword) {
      return NextResponse.json(
        { error: "You cannot reuse a recently used password" },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Save to password history
    await savePasswordHistory(user.id, passwordHash);

    return NextResponse.json(
      { message: "Password reset successfully" },
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
