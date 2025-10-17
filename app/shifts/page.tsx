import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ShiftForm from "@/app/components/ShiftForm";

interface ShiftsPageProps {
  searchParams?: { view?: string };
}

export default async function ShiftsPage({ searchParams }: ShiftsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p>Please sign in.</p>;
  }

  const view = searchParams?.view === "mine" ? "mine" : "all";
  const role = session.user?.role;
  const userId = session.user?.id;

  const guard = userId ? await prisma.guard.findUnique({ where: { userId } }) : null;
  const filters = view === "mine" && guard ? { guardId: guard.id } : undefined;

  const shifts = await prisma.shift.findMany({
    where: filters,
    include: { guard: true },
    orderBy: { start: "asc" },
  });

  const showMyShiftsNotice = view === "mine" && !guard;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-semibold mr-4">Shifts</h1>
        <Link
          href="/shifts?view=all"
          className={`px-3 py-1 border rounded text-sm ${view === "all" ? "bg-gray-200" : "bg-white"}`}
        >
          All shifts
        </Link>
        <Link
          href="/shifts?view=mine"
          className={`px-3 py-1 border rounded text-sm ${view === "mine" ? "bg-gray-200" : "bg-white"}`}
        >
          My shifts
        </Link>
      </div>

      {role === "ADMIN" && <ShiftForm />}

      {showMyShiftsNotice && <p className="text-sm text-gray-600">No guard profile is linked to your account yet.</p>}

      <ul className="space-y-2">
        {shifts.map((shift) => (
          <li key={shift.id} className="p-3 bg-white border rounded">
            <div className="font-medium">
              {shift.title} · {shift.guard ? shift.guard.fullName : "Unassigned"}
            </div>
            <div>
              {new Date(shift.start).toLocaleString()} → {new Date(shift.end).toLocaleString()} · {shift.location}
            </div>
          </li>
        ))}
      </ul>

      {!shifts.length && <p className="text-sm text-gray-600">No shifts found for this view.</p>}
    </div>
  );
}