import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const providers = [
  Credentials({
    name: "Email & Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toLowerCase();
      const password = credentials?.password;
      if (!email || !password) {
        return null;
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) {
        return null;
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return null;
      }

      return user;
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  session: { strategy: "database" },
  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,
};