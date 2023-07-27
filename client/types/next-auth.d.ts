import { SessionBase } from "next-auth/_utils";
import { User as NextAuthUser } from "next-auth";

export interface ExtendedUser extends NextAuthUser {
  id?: string;
  username?: string;
  email?: string;
  image?: string;
  isUsernameSet?: boolean;
}

export interface ExtendedSession extends SessionBase {
  user: ExtendedUser;
}