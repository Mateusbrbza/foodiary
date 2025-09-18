import { sign } from "jsonwebtoken";

export function signAccessToken(userId: string): string {
  const accessToken = sign(
    { sub: userId },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return accessToken;
}
