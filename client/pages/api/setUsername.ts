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
      const user = await prisma.user.update({
        where: { id: userId },
        data: { username: username, isUsernameSet: true },
        
      });

      res.status(200).json({ success: true });

    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(400).json({ message: 'This username is already in use' });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error, please try again' });
      }
    }
  } else {
    res.status(405).end(); 
  }
}
