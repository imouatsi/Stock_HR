import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export const generateTOTP = async (email: string): Promise<{ secret: string; qrCode: string }> => {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, 'Stock HR System', secret);
  const qrCode = await QRCode.toDataURL(otpauth);
  
  return { secret, qrCode };
};

export const verifyTOTP = (token: string, secret: string): boolean => {
  return authenticator.verify({ token, secret });
};
