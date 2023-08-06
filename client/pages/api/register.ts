import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../libs/prismadb"
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

// i18n configuration
i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
    },
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lng = req.body.lng || req.headers['accept-language'] || 'en';
  if (req.method === 'POST') {
    let { username, email, password } = req.body;

    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (!/^[a-zA-Z0-9]{4,16}$/.test(username)) {
      return res.status(400).json({ message: await i18next.t('username_characters_error', { lng }) });
    }
    

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUsername) {
      return res.status(409).json({ message: await i18next.t('already_taken', { lng }) });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return res.status(409).json({ message: await i18next.t('already_registered', { lng }) });
    }

    if (!/^.{8,}$/.test(password)) {
      return res.status(400).json({ message: await i18next.t('password_validation', { lng }) });
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
