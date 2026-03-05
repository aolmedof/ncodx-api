import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { getParam } from './ssm';

const ALGORITHM = 'aes-256-gcm';
const ENCODING = 'hex';

async function getDerivedKey(): Promise<Buffer> {
  const raw = await getParam('/ncodx/prod/encryption_key', 'ENCRYPTION_KEY');
  // Derive a 32-byte key from the passphrase
  return scryptSync(raw, 'ncodx-salt', 32);
}

export async function encrypt(plaintext: string): Promise<{ encryptedValue: string; iv: string; authTag: string }> {
  const key = await getDerivedKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    encryptedValue: encrypted.toString(ENCODING),
    iv: iv.toString(ENCODING),
    authTag: authTag.toString(ENCODING),
  };
}

export async function decrypt(encryptedValue: string, iv: string, authTag: string): Promise<string> {
  const key = await getDerivedKey();
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, ENCODING));
  decipher.setAuthTag(Buffer.from(authTag, ENCODING));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, ENCODING)),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
