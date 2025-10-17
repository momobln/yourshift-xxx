import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInOut } from "@/app/signinout";


export const metadata = { title: "yourShift" };


export default async function RootLayout({ children }: { children: React.ReactNode }) {
const session = await getServerSession(authOptions);
const role = (session?.user as any)?.role as string | undefined;
return (
<html lang="en">
<body className="min-h-screen bg-gray-50">
<nav className="flex gap-4 p-4 bg-white shadow">
<Link href="/">Home</Link>
<Link href="/dashboard">Dashboard</Link>
<Link href="/shifts">Shifts</Link>
{role === "ADMIN" && <Link href="/guards">Guards</Link>}
<Link href="/swaps">Swaps</Link>
<div className="ml-auto"><SignInOut /></div>
</nav>
<main className="p-6 max-w-3xl mx-auto">
{children}
</main>
</body>
</html>
);
}