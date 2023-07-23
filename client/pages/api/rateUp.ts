import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../libs/prismadb'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: 'User Id required' });
  const user = await prisma.user.findUnique({ where: { id: userId }});
  if (!user) return res.status(404).json({ error: "User not found" });
  
  const rateUp = Math.floor(Math.random() * (31 - 19 + 1)) + 19;
  const newRating = user.rating + rateUp;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { rating: newRating },
  });

  res.status(200).json({ user: { ...updatedUser, password: undefined } }); 
}