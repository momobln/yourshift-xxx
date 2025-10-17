import { prisma } from "@/lib/prisma";
import { requireSession, requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const ShiftDto = z.object({
 title: z.string().min(2),
  location: z.string().min(2),
  start: z.string(),
  end: z.string(),
  guardId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET(req: Request) {
const session = await requireSession();
  const url = new URL(req.url);
  const mine = url.searchParams.get("mine");
  const userId = session.user!.id;

  if (mine === "1") {
    const guard = await prisma.guard.findUnique({ where: { userId } });
    const shifts = await prisma.shift.findMany({
      where: { guardId: guard?.id ?? undefined },
      include: { guard: true },
      orderBy: { start: "asc" },
    });
    return Response.json(shifts);
  }

  const data = await prisma.shift.findMany({ include: { guard: true }, orderBy: { start: "asc" } });
  return Response.json(data);
}

export async function POST(req: Request) {
    await requireAdmin();
  const body = ShiftDto.parse(await req.json());
  if (new Date(body.end) <= new Date(body.start)) return new Response("End must be after start", { status: 400 });

  const created = await prisma.shift.create({
    data: { ...body, guardId: body.guardId || null, start: new Date(body.start), end: new Date(body.end) },
  });
  return Response.json(created, { status: 201 });
}
