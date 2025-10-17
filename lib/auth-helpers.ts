import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function requireSession() {
const session = await getServerSession(authOptions);
if (!session?.user) throw new Response("Unauthorized", { status: 401 });
return session;
}


export async function requireAdmin() {
const session = await requireSession();
const role = (session.user as any).role;
if (role !== "ADMIN") throw new Response("Forbidden", { status: 403 });
return session;
}