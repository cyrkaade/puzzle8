import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../libs/prismadb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let { username, email, password } = req.body;

    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (!/^[a-zA-Z0-9]{4,16}$/.test(username)) {
      return res.status(400).json({ message: 'Username should be 4-16 characters long and contain only letters and numbers without spaces.' });
    }
    

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUsername) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    if (!/^(?=.*[A-Za-z])[A-Za-z\d$@$!%*#?&]{8,}$/.test(password)) {
      return res.status(400).json({ message: 'Password should be at least 8 characters long and contain at least one letter.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
        isUsernameSet: true
      },
    });

    res.status(200).json(user);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
