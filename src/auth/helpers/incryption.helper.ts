import * as bcrypt from 'bcrypt';

// Function for user registration for future logic to be implemented
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}