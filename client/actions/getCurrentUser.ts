import { getServerSession } from "next-auth/next"

import { authOptions } from '../pages/api/auth/[...nextauth]'
import prisma from '../libs/prismadb'

import dynamic from 'next/dynamic'

export async function getSessionNow() {
  return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
    try {
      const session = await getSessionNow();
  
      if (!session?.user?.email) {
        return null;
      }
  
      const currentUser = await prisma.user.findUnique({
        where: {
          email: session.user.email as string,
        }
      });
  
      if (!currentUser) {
        return null;
      }
  
      return {
        ...currentUser,
        createdAt: new Date(currentUser.createdAt),
        updatedAt: new Date(currentUser.updatedAt),
        emailVerified: 
          currentUser.emailVerified ? new Date(currentUser.emailVerified) : null,
      };
    } catch (error: any) {
      return null;
    }
  }
  
