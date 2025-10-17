import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const Decide = z.object({ action: z.enum(["APPROVE", "REJECT"]), toGuardId: z.string().optional() });

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await requireAdmin();
  const { action, toGuardId } = Decide.parse(await req.json());
  const swap = await prisma.swapRequest.findUnique({ where: { id: params.id } });
  if (!swap) return new Response("Not found", { status: 404 });

  if (action === "APPROVE") {
    if (!toGuardId) return new Response("toGuardId required", { status: 400 });
    const targetGuard = await prisma.guard.findUnique({ where: { id: toGuardId } });
    if (!targetGuard) return new Response("Guard not found", { status: 404 });

    await prisma.$transaction([
      prisma.swapRequest.update({ where: { id: params.id }, data: { status: "APPROVED", toGuardId } }),
      prisma.shift.update({ where: { id: swap.shiftId }, data: { guardId: toGuardId } }),
    ]);
    return Response.json({ ok: true });
  }

  await prisma.swapRequest.update({ where: { id: params.id }, data: { status: "REJECTED" } });
  return Response.json({ ok: true });
}
