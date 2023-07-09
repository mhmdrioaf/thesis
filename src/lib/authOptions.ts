import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { ROUTES } from "./constants";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: "text" },
        password: { type: "text" },
      },
      async authorize(credentials) {
        const authResponse = await fetch(
          process.env.NEXT_PUBLIC_API_AUTH_LOGIN!,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        const user = await authResponse.json();

        if (authResponse.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.image = token.picture;
        session.user.dateOfBirth = token.dateOfBirth;
        session.user.phoneNumber = token.phoneNumber;
        session.user.role = token.role;
        session.user.storeAddress = token.storeAddress;
        session.user.token = token.token;
      }

      return session;
    },

    async jwt({ token, user }) {
      const customer = await db.customer.findFirst({
        where: { email: token.email! },
      });
      const seller = await db.seller.findFirst({
        where: { email: token.email! },
      });
      const administrator = await db.administrator.findFirst({
        where: { email: token.email! },
      });

      if (customer) {
        return {
          id: customer.id,
          name: customer.name,
          dateOfBirth: customer.dateOfBirth,
          email: customer.email,
          picture: customer.imageURL,
          phoneNumber: customer.phoneNumber?.toString(),
          username: customer.username,
          role: "CUSTOMER",
        };
      } else if (seller) {
        return {
          id: seller.id,
          name: seller.name,
          email: seller.email,
          picture: seller.imageURL,
          phoneNumber: seller.phoneNumber?.toString(),
          username: seller.username,
          storeAddress: seller.storeAddress,
          role: "SELLER",
          token: seller.token,
        };
      } else if (administrator) {
        return {
          id: administrator.id,
          name: administrator.name,
          email: administrator.email,
          picture: administrator.imageURL,
          username: administrator.username,
          role: "ADMINISTRATOR",
          token: administrator.token,
        };
      } else {
        token.id = user!.id;
        return token;
      }
    },
  },
  pages: {
    signIn: ROUTES.AUTH.LOGIN,
  },
};
