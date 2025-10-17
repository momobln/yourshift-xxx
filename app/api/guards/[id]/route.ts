import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/auth-helpers";
import { z } from "zod";

const UpdateGuard = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  mobile: z.string().min(6).optional().nullable(),
  workId: z.string().min(3).optional(),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
 await requireSession();
  const guard = await prisma.guard.findUnique({ where: { id: params.id } });
  if (!guard) return new Response("Not found", { status: 404 });
  return Response.json(guard);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
 await requireAdmin();
  const data = UpdateGuard.parse(await req.json());
  const updated = await prisma.guard.update({ where: { id: params.id }, data });
  return Response.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
 await requireAdmin();
  await prisma.guard.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}