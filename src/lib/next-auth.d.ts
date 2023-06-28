import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;
type UserUsername = string;
type UserPhone = number;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    phoneNumber?: UserPhone;
    username: UserUsername;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      phoneNumber?: UserPhone;
      username: UserUsername;
    };
  }
}
