import bcrypt from 'bcryptjs';

export function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export async function hashOtp(otp: string) {
  return await bcrypt.hash(otp, 10);
}

export async function compareOtp(plain: string, hash: string) {
  return await bcrypt.compare(plain, hash);
}
