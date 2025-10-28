import * as crypto from 'crypto';

export function generateOtp(secret: string): string {
  const time: number = Math.floor(Date.now() / 1000 / 30);
  
  // Create a buffer for the time
  const timeBuffer: Buffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(Math.floor(time / Math.pow(2, 32)), 0);
  timeBuffer.writeUInt32BE(time & 0xffffffff, 4);

  // Create HMAC using SHA1 and the provided secret
  const hmac: crypto.Hmac = crypto.createHmac('sha1', secret);
  hmac.update(timeBuffer);
  const hash: Buffer = hmac.digest();

  // Get the offset for OTP extraction
  const offset: number = hash[19] & 0xf;

  // Extract the OTP (6 digits)
  const otp: number = (hash.readUInt32BE(offset) & 0x7fffffff) % 1000000;

  // Return OTP as a 6-digit string, padded with leading zeros
  return otp.toString().padStart(6, '0');
}