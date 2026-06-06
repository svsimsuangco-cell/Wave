import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: '7d' });
}

export async function getAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;
    if (!token) return null;
    const decoded = await verifyToken(token);
    return decoded as { userId: string } | null;
  } catch (error) {
    return null;
  }
}
