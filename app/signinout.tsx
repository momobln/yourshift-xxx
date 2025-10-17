"use client";
import { signIn, signOut } from "next-auth/react";


export function SignInOut() {
return (
<div className="flex gap-2">
<button className="px-3 py-1 border" onClick={() => signIn("google")}>Sign in</button>
<button className="px-3 py-1 border" onClick={() => signOut()}>Sign out</button>
</div>
);
}