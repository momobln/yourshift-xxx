import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";
import { z } from "zod";

const CreateSwap = z.object({ shiftId: z.string() });

export async function GET() {
await requireSession();
  const list = await prisma.swapRequest.findMany({
    include: { shift: true, fromGuard: true, toGuard: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(list);
}

export async function POST(req: Request) {
 const session = await requireSession();
  const userId = session.user!.id;
  const guard = await prisma.guard.findUnique({ where: { userId } });
  if (!guard) return new Response("No guard profile", { status: 400 });

  const { shiftId } = CreateSwap.parse(await req.json());
  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  if (!shift || shift.guardId !== guard.id) return new Response("Not your shift", { status: 403 });

  const request = await prisma.swapRequest.create({ data: { shiftId, fromGuardId: guard.id } });
  return Response.json(request, { status: 201 });
}