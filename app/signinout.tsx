"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function SignInOut() {
const { data: session, status } = useSession();

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Signed in as {session.user?.email ?? session.user?.name}
        </span>
        <button className="px-3 py-1 border rounded" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      className="px-3 py-1 border rounded text-sm"
      type="button"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </button>
  );
}