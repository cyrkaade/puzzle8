
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../libs/prismadb'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: 'User Id required' });
  const user = await prisma.user.findUnique({ where: { id: userId }});
  if (!user) return res.status(404).json({ error: "User not found" });

  const newSolvedPuzzles = user.solvedPuzzles + 1;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { solvedPuzzles: newSolvedPuzzles },
  });

  res.status(200).json({ user: { ...updatedUser, password: undefined } }); 
}
