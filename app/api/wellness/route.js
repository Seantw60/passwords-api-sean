import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { wellnessCheckinSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

// GET /api/wellness - Get user's wellness check-ins (private)
export async function GET(request) {
  try {
    const token = await requirePermission(request, "wellness:read");
    if (token instanceof NextResponse) return token;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Strict ownership check - users can only see their own wellness data
    const [wellness, total] = await Promise.all([
      prisma.wellness.findMany({
        where: { userId: token.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.wellness.count({
        where: { userId: token.id },
      }),
    ]);

    return NextResponse.json({
      wellness,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/wellness - Create wellness check-in
export async function POST(request) {
  try {
    const token = await requirePermission(request, "wellness:create");
    if (token instanceof NextResponse) return token;

    const body = await request.json();
    const validated = wellnessCheckinSchema.parse(body);

    const checkin = await prisma.wellness.create({
      data: {
        ...validated,
        userId: token.id,
      },
    });

    return NextResponse.json({ checkin }, { status: 201 });
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
