import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function GuardsPage() {
const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session) return <p>Please sign in.</p>;
  if (role !== "ADMIN") return <p>Forbidden</p>;

  const guards = await prisma.guard.findMany({ orderBy: { fullName: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Guards</h1>
      <ul className="space-y-2">
        {guards.map((guard) => (
          <li key={guard.id} className="p-3 bg-white border rounded">
            <div className="font-medium">{guard.fullName}</div>
            <div className="text-sm text-gray-600">
              {guard.email} · {guard.workId}
              {guard.mobile ? ` · ${guard.mobile}` : ""}
            </div>
          </li>
        ))}
      </ul>
      {!guards.length && <p className="text-sm text-gray-600">No guards added yet.</p>}
    </div>
  );
}