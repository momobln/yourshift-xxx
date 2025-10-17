import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all shifts
export async function GET() {
  const shifts = await prisma.shift.findMany({
    include: { guard: true },
  });
  return NextResponse.json(shifts);
}

// POST new shift
export async function POST(req: Request) {
  const data = await req.json();
  const shift = await prisma.shift.create({ data });
  return NextResponse.json(shift);
}
