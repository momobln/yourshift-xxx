import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ShiftForm from "@/app/components/ShiftForm";


export default async function ShiftsPage() {
const session = await getServerSession(authOptions);
if (!session) return <p>Please sign in.</p>;
const role = (session.user as any).role;
const shifts = await prisma.shift.findMany({ include: { guard: true }, orderBy: { start: "asc" } });
return (
<div>
<h1 className="text-xl font-semibold mb-4">All Shifts</h1>
{role === "ADMIN" && <ShiftForm />}
<ul className="space-y-2 mt-4">
{shifts.map(s => (
<li key={s.id} className="p-3 bg-white border rounded">
<div className="font-medium">{s.title} {s.guard ? `· ${s.guard.fullName}` : "· Unassigned"}</div>
<div>{new Date(s.start).toLocaleString()} → {new Date(s.end).toLocaleString()} · {s.location}</div>
</li>
))}
</ul>
</div>
);
}