import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
const session = await getServerSession(authOptions);
  if (!session) return <p>Please sign in.</p>;

  const userId = session.user?.id;
  if (!userId) return <p>Missing user identifier.</p>;

  const guard = await prisma.guard.findUnique({ where: { userId } });
  const shifts = await prisma.shift.findMany({ where: { guardId: guard?.id ?? undefined }, orderBy: { start: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">My Shifts</h1>
      <ul className="space-y-2">
        {shifts.map((shift) => (
          <li key={shift.id} className="p-3 bg-white border rounded">
            <div className="font-medium">{shift.title}</div>
            <div>
              {new Date(shift.start).toLocaleString()} → {new Date(shift.end).toLocaleString()} · {shift.location}
            </div>
          </li>
        ))}
      </ul>
      {!shifts.length && <p className="text-sm text-gray-600">No shifts assigned to you yet.</p>}
    </div>
  );
}