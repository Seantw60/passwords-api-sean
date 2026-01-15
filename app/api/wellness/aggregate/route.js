import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

// GET /api/wellness/aggregate - Get anonymized aggregated wellness data (admin only)
export async function GET(request) {
  try {
    const token = await requirePermission(request, "admin:access");
    if (token instanceof NextResponse) return token;

    // Aggregate wellness data (anonymized)
    const [totalCheckins, avgStress, moodDistribution] = await Promise.all([
      prisma.wellness.count(),
      prisma.wellness.aggregate({
        _avg: { stress: true },
      }),
      prisma.wellness.groupBy({
        by: ["mood"],
        _count: true,
      }),
    ]);

    // Get participation rate (users who have checked in)
    const totalUsers = await prisma.user.count();
    const usersWithCheckins = await prisma.wellness.findMany({
      select: { userId: true },
      distinct: ["userId"],
    });

    const participationRate = totalUsers > 0 
      ? (usersWithCheckins.length / totalUsers) * 100 
      : 0;

    return NextResponse.json({
      totalCheckins,
      avgStress: avgStress._avg.stress || 0,
      moodDistribution,
      participationRate: Math.round(participationRate),
      totalUsers,
      usersWithCheckins: usersWithCheckins.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
