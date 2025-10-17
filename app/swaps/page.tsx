import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SwapRequestForm from "@/app/swaps/SwapRequestForm";
import SwapAdminActions from "@/app/swaps/SwapAdminActions";

export default async function SwapsPage() {
    const session = await getServerSession(authOptions);
  if (!session) return <p>Please sign in.</p>;

  const userId = session.user?.id;
  const role = session.user?.role;
  if (!userId || !role) return <p>Missing user information.</p>;

  const guard = await prisma.guard.findUnique({ where: { userId } });

  const [myShifts, swaps, guards] = await Promise.all([
    guard
      ? prisma.shift.findMany({ where: { guardId: guard.id }, orderBy: { start: "asc" } })
      : Promise.resolve([]),
    prisma.swapRequest.findMany({
      include: { shift: true, fromGuard: true, toGuard: true },
      orderBy: { createdAt: "desc" },
    }),
    role === "ADMIN" ? prisma.guard.findMany({ orderBy: { fullName: "asc" } }) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Swaps</h1>

      {guard ? (
        <SwapRequestForm
          shifts={myShifts.map((shift) => ({ id: shift.id, title: shift.title, start: shift.start.toISOString() }))}
        />
      ) : (
        <p className="text-sm text-gray-600">No guard profile linked to your account yet.</p>
      )}

      <ul className="space-y-3">
        {swaps.map((swap) => (
          <li key={swap.id} className="p-3 bg-white border rounded space-y-2">
            <div className="font-medium">{swap.shift.title}</div>
            <div className="text-sm text-gray-600">
              Requested by {swap.fromGuard.fullName} on {swap.createdAt.toLocaleString()} · Status: {swap.status}
            </div>
            {swap.toGuard && (
              <div className="text-sm text-gray-600">Will be covered by {swap.toGuard.fullName}</div>
            )}
            {role === "ADMIN" && swap.status === "PENDING" && (
              <SwapAdminActions swapId={swap.id} guards={guards} excludeGuardId={swap.fromGuardId} />
            )}
          </li>
        ))}
      </ul>

      {!swaps.length && <p className="text-sm text-gray-600">No swap requests yet.</p>}
    </div>
  );
}
