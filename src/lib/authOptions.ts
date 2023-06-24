import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth/core/types";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { User } from "@prisma/client";
import { API_AUTH, AUTH } from "./constants";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: "text" },
        password: { type: "text" },
      },
      async authorize(credentials) {
        const authResponse = await fetch(API_AUTH.LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!authResponse.ok) {
          return null;
        }

        const user = await authResponse.json();

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.user.findFirst({
        where: {
          id: token.id,
        },
      })) as User | null;

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        (session.user.id = token.id),
          (session.user.email = token.email),
          (session.user.name = token.name),
          (session.user.image = token.picture);
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: AUTH.LOGIN,
  },
};
