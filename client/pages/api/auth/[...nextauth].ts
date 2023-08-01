import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../libs/prismadb"
import { ExtendedUser } from '../../../types/next-auth'
import { setCookie } from 'nookies';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isUsernameSet?: boolean;
    id?: string;
    provider?: string; // new field
  }
}

type Token = {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  id?: string;
  isUsernameSet: boolean;
  provider?: string; // new field
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      }
    })
  ],
  callbacks: {
    async session({ session, token: unknownToken }) {
      const token = unknownToken as Token; // Explicitly tell TypeScript that unknownToken is a Token
    
      const extendedSession: ExtendedSession = {
        ...session,
        user: {
          ...session.user,
          isUsernameSet: token?.isUsernameSet,
          id: token?.id, // add it here if it exists
          provider: token?.provider // add provider here if it exists
        },
      };
      
      return extendedSession;
    },


    async jwt({ token, user, account }) {
      const extendedUser = user as ExtendedUser | null;
      console.log("JWT callback - token:", token);
      console.log("JWT callback - user:", user);
      console.log("JWT callback - account:", account);
      if (extendedUser) {
        let username = extendedUser.username;
        if(!username) {
          username = `temp-${extendedUser.id}`;
          await prisma.user.update({
            where: { id: extendedUser.id },
            data: { username },
          });

          setCookie(undefined, 'username', username, { path: '/' }); 
        }
        token = {
          ...token,
          username,
          isUsernameSet: extendedUser.isUsernameSet,
          id: extendedUser.id,
          provider: account?.provider
        };
      }
      return token;
    }
  },
  
  
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);