import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";


const GuardDto = z.object({ fullName: z.string().min(2), email: z.string().email(), mobile: z.string().optional(), workId: z.string().min(3), userId: z.string() });


export async function GET() {
const data = await prisma.guard.findMany({ orderBy: { fullName: "asc" } });
return Response.json(data);
}


export async function POST(req: Request) {
await requireAdmin();
const body = GuardDto.parse(await req.json());
const exists = await prisma.guard.findFirst({ where: { OR: [{ email: body.email }, { workId: body.workId }, { userId: body.userId }] } });
if (exists) return new Response("Guard exists", { status: 409 });
const g = await prisma.guard.create({ data: body });
return Response.json(g, { status: 201 });
}