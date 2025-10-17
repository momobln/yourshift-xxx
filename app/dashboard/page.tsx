import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export default async function Dashboard() {
const session = await getServerSession(authOptions);
if (!session) return <p>Please sign in.</p>;
const userId = (session.user as any).id as string;
const guard = await prisma.guard.findUnique({ where: { userId } });
const shifts = await prisma.shift.findMany({ where: { guardId: guard?.id ?? undefined }, orderBy: { start: "asc" } });
return (
<div>
<h1 className="text-xl font-semibold mb-4">My Shifts</h1>
<ul className="space-y-2">
{shifts.map(s => (
<li key={s.id} className="p-3 bg-white border rounded">
<div className="font-medium">{s.title}</div>
<div>{new Date(s.start).toLocaleString()} → {new Date(s.end).toLocaleString()}</div>
</li>
))}
</ul>
</div>
);
}