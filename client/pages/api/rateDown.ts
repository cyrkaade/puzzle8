// rateDown.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../libs/prismadb'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: 'User Id required' });
  const user = await prisma.user.findUnique({ where: { id: userId }});
  if (!user) return res.status(404).json({ error: "User not found" });
  
  const rateDown = Math.floor(Math.random() * (27 - 13 + 1)) + 13;
  const newRating = user.rating - rateDown;
  const newUnsolvedPuzzles = user.unsolvedPuzzles + 1;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { rating: newRating, unsolvedPuzzles: newUnsolvedPuzzles },
  });

  res.status(200).json({ user: { ...updatedUser, password: undefined } }); 
}
