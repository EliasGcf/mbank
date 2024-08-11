import { env } from '@env';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  sub: string;
}

export function signJWT(payload: JWTPayload) {
  return jwt.sign(payload, env.JWT_SECRET);
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}
