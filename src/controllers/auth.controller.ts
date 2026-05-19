import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from '../db/schema';
import { google } from 'googleapis';

const db = drizzle(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET!;
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  'http://localhost:3000/api/auth/google/callback',
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Google Login
export const googleLogin = async (req: Request, res: Response) => {
  const { role } = req.query;

  if (!role || !['penyalur', 'penerima'].includes(role as string)) {
    return res.status(400).json({ error: 'Role tidak valid' });
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    state: role as string, // kirim role sebagai state
  });
  res.redirect(url);
};

// callback
export const callbackGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code, state } = req.query;
    const role = state === 'penyalur' ? 'penyalur' : 'penerima';

    if (!code) {
      return res.status(400).json({ error: 'Authorization code tidak ada' });
    }

    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.name) {
      return res
        .status(400)
        .json({ error: 'Gagal mendapatkan data dari Google' });
    }

    let user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email));

    if (user.length === 0) {
      user = await db
        .insert(usersTable)
        .values({
          email: data.email,
          role,
        })
        .returning();
    }

    const payload = {
      id: user[0].id,
      role: user[0].role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth?token=${token}&email=${user[0].email}&role=${user[0].role}`,
    );
  } catch (error) {
    next(error);
  }
};

// manual regist
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, selectedRoleole } = req.body;

    // cek apakah email sudah terdaftar
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length !== 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // hash pw
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // insert user baru
    const newUser = await db
      .insert(usersTable)
      .values({
        email,
        password: hashedPassword,
        role: selectedRoleole,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
      });

    res.status(201).json({ message: 'Registrasi berhasil', user: newUser[0] });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // cari user by email
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (user.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah' });
    } else if (user[0].password === null) {
      return res.status(401).json({
        error:
          'Akun ini belum memiliki password, silakan set password terlebih dahulu',
      });
    }

    // bandingin pw
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // generate jwt
    const payload = {
      id: user[0].id,
      role: user[0].role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  // Untuk logout, kita bisa zmenghapus token di sisi client
  res.json({ message: 'Logout berhasil' });
};
