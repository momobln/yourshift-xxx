"use client";
import { useState, useEffect } from "react";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("/api/shifts")
      .then(res => res.json())
      .then(data => setShifts(data));
  }, []);

  const addShift = async () => {
    await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        location: "Berlin",
        start: new Date(),
        end: new Date(Date.now() + 2 * 3600 * 1000),
      }),
    });
    setTitle("");
    const updated = await fetch("/api/shifts").then(res => res.json());
    setShifts(updated);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Shifts</h1>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Shift title"
      />
      <button onClick={addShift}>Add Shift</button>
      <ul>
        {shifts.map((s: any) => (
          <li key={s.id}>
            {s.title} – {s.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
