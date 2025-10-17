import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/auth-helpers";
import { z } from "zod";

const GuardDto = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(6).optional(),
  workId: z.string().min(3),
  userId: z.string(),
});

export async function GET() {
 await requireSession();
  const data = await prisma.guard.findMany({ orderBy: { fullName: "asc" } });
  return Response.json(data);
}

export async function POST(req: Request) {
 await requireAdmin();
  const body = GuardDto.parse(await req.json());
  const email = body.email.toLowerCase();

  const exists = await prisma.guard.findFirst({
    where: {
      OR: [{ email }, { workId: body.workId }, { userId: body.userId }],
    },
  });
  if (exists) return new Response("Guard exists", { status: 409 });

  const user = await prisma.user.findUnique({ where: { id: body.userId } });
  if (!user) return new Response("User not found", { status: 404 });

  const guard = await prisma.guard.create({
    data: { ...body, email },
  });

  return Response.json(guard, { status: 201 });
}