"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ShiftOption {
  id: string;
  title: string;
  start: string;
}

export default function SwapRequestForm({ shifts }: { shifts: ShiftOption[] }) {
  const router = useRouter();
  const [shiftId, setShiftId] = useState(shifts[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!shiftId) {
      setError("Select a shift first.");
      return;
    }

    setPending(true);
    const response = await fetch("/api/swaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId }),
    });
    setPending(false);

    if (!response.ok) {
      const message = await response.text();
      setError(message || "Could not request a swap.");
      return;
    }

    router.refresh();
  };

  const hasShifts = shifts.length > 0;

  return (
    <form onSubmit={submit} className="p-3 border rounded bg-white space-y-2">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="shiftId">
          Request a swap for one of your shifts
        </label>
        <select
          id="shiftId"
          name="shiftId"
          className="border p-2 w-full"
          value={shiftId}
          onChange={(event) => setShiftId(event.target.value)}
          disabled={!hasShifts || pending}
        >
          {shifts.map((shift) => (
            <option key={shift.id} value={shift.id}>
              {shift.title} · {new Date(shift.start).toLocaleString()}
            </option>
          ))}
        </select>
      </div>
      <button className="px-3 py-1 border rounded" type="submit" disabled={!hasShifts || pending}>
        {pending ? "Submitting..." : "Request swap"}
      </button>
      {!hasShifts && <p className="text-sm text-gray-600">You have no shifts to swap.</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}