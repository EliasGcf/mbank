import jwt from 'jsonwebtoken';

import { env } from '@env';

interface JWTPayload {
  sub: string;
}

export function signJWT(payload: JWTPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '30m' });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRequiredJWT(token: string) {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}
