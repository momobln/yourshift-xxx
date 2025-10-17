"use client";
import { useState, useEffect } from "react";


export default function ShiftForm() {
const [guards, setGuards] = useState<any[]>([]);
const [form, setForm] = useState({ title: "", location: "", start: "", end: "", guardId: "" });


useEffect(() => { fetch("/api/guards").then(r=>r.json()).then(setGuards); }, []);


const submit = async () => {
const res = await fetch("/api/shifts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
if (res.ok) location.reload();
};


return (
<div className="p-3 border rounded bg-white mb-4">
<h2 className="font-medium mb-2">Create Shift</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
<input className="border p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
<input className="border p-2" placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
<input className="border p-2" type="datetime-local" value={form.start} onChange={e=>setForm({...form,start:e.target.value})} />
<input className="border p-2" type="datetime-local" value={form.end} onChange={e=>setForm({...form,end:e.target.value})} />
<select className="border p-2" value={form.guardId} onChange={e=>setForm({...form,guardId:e.target.value})}>
<option value="">Unassigned</option>
{guards.map(g=> <option key={g.id} value={g.id}>{g.fullName}</option>)}
</select>
</div>
<button className="mt-2 px-3 py-1 border" onClick={submit}>Save</button>
</div>
);
}