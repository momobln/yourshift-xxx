import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
await requireAdmin();
const data = await req.json();
const updated = await prisma.shift.update({ where: { id: params.id }, data: { ...data, start: data.start ? new Date(data.start) : undefined, end: data.end ? new Date(data.end) : undefined } });
return Response.json(updated);
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
await requireAdmin();
await prisma.shift.delete({ where: { id: params.id } });
return new Response(null, { status: 204 });
}