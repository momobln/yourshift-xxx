import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";


export const authOptions: NextAuthOptions = {
adapter: PrismaAdapter(prisma),
providers: [
Google({
clientId: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),
],
callbacks: {
async session({ session, user }) {
if (session.user) {
(session.user as any).id = user.id;
(session.user as any).role = (user as any).role;
}
return session;
},
},
session: { strategy: "database" },
pages: { signIn: "/" },
secret: process.env.NEXTAUTH_SECRET,
};