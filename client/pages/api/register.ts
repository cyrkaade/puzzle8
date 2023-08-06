import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../libs/prismadb"
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    let { username, email, password } = req.body;
    const i18n = i18next.createInstance();

    await i18n.use(Backend).init({
      initImmediate: false,
      lng: req.body.locale || "en", 
      fallbackLng: "en", 
      ns: ["common"], 
      backend: {
        loadPath: path.join(process.cwd(), "public/locales/{{lng}}/{{ns}}.json"),
      },
    });

    username = username.trim();
    email = email.trim();
    password = password.trim();

    

    if (!/^[a-zA-Z0-9]{4,16}$/.test(username)) {
      return res.status(400).json({ message: i18n.t('username_characters_error') });
    }
    

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUsername) {
      return res.status(409).json({ message: i18n.t('already_taken') });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return res.status(409).json({ message: i18n.t('already_registered') });
    }

    if (!/^.{8,}$/.test(password)) {
      return res.status(400).json({ message: i18n.t('password_validation') });
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
