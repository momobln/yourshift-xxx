import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInOut } from "@/app/signinout";
import AuthSessionProvider from "@/app/components/AuthSessionProvider";

export const metadata = { title: "yourShift" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthSessionProvider session={session}>
          <nav className="flex flex-wrap items-center gap-4 p-4 bg-white shadow">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/shifts">Shifts</Link>
            {role === "ADMIN" && <Link href="/guards">Guards</Link>}
            <Link href="/swaps">Swaps</Link>
            <div className="ml-auto">
              <SignInOut />
            </div>
          </nav>
          <main className="p-6 max-w-3xl mx-auto">{children}</main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}