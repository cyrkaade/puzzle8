import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { userId, username } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user && user.username?.startsWith('temp-')) {
        await prisma.user.update({
          where: { id: userId },
          data: { username: null },
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { username, isUsernameSet: true },
      });
      const newToken = {
        username: updatedUser.username,
        isUsernameSet: true,
      };
      res.status(200).json({ user: updatedUser, success: true, refreshSession: true, token: newToken });

    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(400).json({ message: 'This username is already in use' });
      } else {
        res.status(500).json({ message: 'Unexpected error, please try again' });
      }
    }
  } else {
    res.status(405).end(); 
  }
}
