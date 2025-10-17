import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export default async function SwapsPage() {
const session = await getServerSession(authOptions);
if (!session) return <p>Please sign in.</p>;
const userId = (session.user as any).id as string;
const guard = await prisma.guard.findUnique({ where: { userId } });
const myShifts = await prisma.shift.findMany({ where: { guardId: guard?.id }, orderBy: { start: "asc" } });
const swaps = await prisma.swapRequest.findMany({ include: { shift: true, fromGuard: true, toGuard: true }, orderBy: { createdAt: "desc" } });


async function create(formData: FormData) {
"use server";
const shiftId = formData.get("shiftId") as string;
await fetch(`${process.env.NEXTAUTH_URL}/api/swaps`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shiftId }) });
}


return (
<div>
<h1 className="text-xl font-semibold mb-4">Swaps</h1>
<form action={create} className="p-3 border rounded bg-white mb-4">
<label className="block mb-1">Request swap for one of your shifts:</label>
<select name="shiftId" className="border p-2">
{myShifts.map(s=> (<option key={s.id} value={s.id}>{s.title} · {new Date(s.start).toLocaleString()}</option>))}
</select>
<button className="ml-2 px-3 py-1 border">Request</button>
</form>


<ul className="space-y-2">
{swaps.map(w => (
<li key={w.id} className="p-3 bg-white border rounded">
<div className="font-medium">{w.shift.title} · {w.status}</div>
<div>By: {w.fromGuard.fullName}</div>
</li>
))}
</ul>
</div>
);
}