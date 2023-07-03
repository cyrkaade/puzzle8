import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../libs/prismadb"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    res.status(200).json(user);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}