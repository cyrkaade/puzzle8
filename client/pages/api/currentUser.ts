import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react';
import prisma from '../../libs/prismadb'; // adjust the path as per your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (session && session.user) {
    const email = session.user.email || "";
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      res.status(200).json({ user: { ...user, password: undefined } });  // remove password from the response
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}