"use client";

import { useEffect, useState } from "react";

interface GuardSummary {
  id: string;
  fullName: string;
}

interface FormState {
  title: string;
  location: string;
  start: string;
  end: string;
  guardId: string;
}

const emptyForm: FormState = { title: "", location: "", start: "", end: "", guardId: "" };

export default function ShiftForm() {
const [guards, setGuards] = useState<GuardSummary[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch("/api/guards")
      .then((response) => response.json())
      .then((data) => setGuards(data as GuardSummary[]))
      .catch(() => setGuards([]));
  }, []);

  const submit = async () => {
    setError(null);

    if (!form.title.trim() || !form.location.trim() || !form.start || !form.end) {
      setError("All fields except guard are required.");
      return;
    }

    if (new Date(form.end) <= new Date(form.start)) {
      setError("End time must be after the start time.");
      return;
    }

    setPending(true);
    const res = await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        guardId: form.guardId || null,
      }),
    });
    setPending(false);

    if (!res.ok) {
      const message = await res.text();
      setError(message || "Could not save shift.");
      return;
    }

    setForm(emptyForm);
    window.location.reload();
  };

  return (
    <div className="p-3 border rounded bg-white mb-4 space-y-2">
      <h2 className="font-medium">Create Shift</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          className="border p-2"
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Location"
          value={form.location}
          onChange={(event) => setForm({ ...form, location: event.target.value })}
        />
        <input
          className="border p-2"
          type="datetime-local"
          value={form.start}
          onChange={(event) => setForm({ ...form, start: event.target.value })}
        />
        <input
          className="border p-2"
          type="datetime-local"
          value={form.end}
          onChange={(event) => setForm({ ...form, end: event.target.value })}
        />
        <select
          className="border p-2"
          value={form.guardId}
          onChange={(event) => setForm({ ...form, guardId: event.target.value })}
        >
          <option value="">Unassigned</option>
          {guards.map((guard) => (
            <option key={guard.id} value={guard.id}>
              {guard.fullName}
            </option>
          ))}
        </select>
      </div>
      <button className="mt-1 px-3 py-1 border rounded" onClick={submit} disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}