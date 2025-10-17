"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const initialForm = { email: "", password: "" };

export function SignInOut() {
    const { data: session, status } = useSession();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setPending(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setPending(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    setForm(initialForm);
  };

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Signed in as {session.user?.email ?? session.user?.name}</span>
        <button className="px-3 py-1 border rounded" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-wrap gap-2 items-start" onSubmit={handleSignIn}>
      <input
        className="border rounded px-2 py-1 text-sm"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
      />
      <input
        className="border rounded px-2 py-1 text-sm"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
      />
      <button className="px-3 py-1 border rounded text-sm" type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {error && <p className="text-xs text-red-600 w-full">{error}</p>}
    </form>
  );
}