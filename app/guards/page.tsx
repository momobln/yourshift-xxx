import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export default async function GuardsPage() {
const session = await getServerSession(authOptions);
const role = (session?.user as any)?.role;
if (!session) return <p>Please sign in.</p>;
if (role !== "ADMIN") return <p>Forbidden</p>;
const guards = await prisma.guard.findMany({ orderBy: { fullName: "asc" } });
return (
<div>
<h1 className="text-xl font-semibold mb-4">Guards</h1>
<ul className="space-y-2">
{guards.map(g => (
<li key={g.id} className="p-3 bg-white border rounded">
<div className="font-medium">{g.fullName}</div>
<div>{g.email} · {g.workId}</div>
</li>
))}
</ul>
</div>
);
}