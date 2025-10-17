import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";


export async function GET(_: Request, { params }: { params: { id: string } }) {
const g = await prisma.guard.findUnique({ where: { id: params.id } });
if (!g) return new Response("Not found", { status: 404 });
return Response.json(g);
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
await requireAdmin();
const data = await req.json();
const updated = await prisma.guard.update({ where: { id: params.id }, data });
return Response.json(updated);
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
await requireAdmin();
await prisma.guard.delete({ where: { id: params.id } });
return new Response(null, { status: 204 });
}