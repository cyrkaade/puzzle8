

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react';
import prisma from '../../libs/prismadb'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (session && session.user) {
    const email = session.user.email || "";
    const newRating = req.body.rating;

    const user = await prisma.user.update({
      where: { email },
      data: { rating: newRating },
    });

    if (user) {
      res.status(200).json({ user: { ...user, password: undefined } });  
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}
