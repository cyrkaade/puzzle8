import { SessionBase } from "next-auth/_utils";
import { User as NextAuthUser } from "next-auth";

export interface ExtendedUser extends NextAuthUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  isUsernameSet?: boolean;
  provider?: string;
  username?: string; 
}

export interface ExtendedSession extends SessionBase {
  user: ExtendedUser;
}