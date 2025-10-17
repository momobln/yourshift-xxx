"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GuardOption {
  id: string;
  fullName: string;
}

export default function SwapAdminActions({
  swapId,
  guards,
  excludeGuardId,
}: {
  swapId: string;
  guards: GuardOption[];
  excludeGuardId?: string;
}) {
  const router = useRouter();
  const [toGuardId, setToGuardId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const eligibleGuards = guards.filter((guard) => guard.id !== excludeGuardId);

  const callApi = async (body: Record<string, string>) => {
    setPending(true);
    setError(null);
    const response = await fetch(`/api/swaps/${swapId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setPending(false);

    if (!response.ok) {
      const message = await response.text();
      setError(message || "Action failed.");
      return;
    }

    setToGuardId("");
    router.refresh();
  };

  const approve = async () => {
    if (!toGuardId) {
      setError("Select the guard who will take the shift.");
      return;
    }
    await callApi({ action: "APPROVE", toGuardId });
  };

  const reject = async () => {
    await callApi({ action: "REJECT" });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="border p-2 text-sm"
          value={toGuardId}
          onChange={(event) => setToGuardId(event.target.value)}
          disabled={!eligibleGuards.length || pending}
        >
          <option value="">Select guard to assign</option>
          {eligibleGuards.map((guard) => (
            <option key={guard.id} value={guard.id}>
              {guard.fullName}
            </option>
          ))}
        </select>
        <button className="px-3 py-1 border rounded text-sm" onClick={approve} disabled={pending}>
          Approve
        </button>
        <button className="px-3 py-1 border rounded text-sm" onClick={reject} disabled={pending}>
          Reject
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!eligibleGuards.length && <p className="text-xs text-gray-600">Add more guards to approve this swap.</p>}
    </div>
  );
}