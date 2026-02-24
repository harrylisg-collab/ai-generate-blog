import { query as dbQuery } from './db';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await dbQuery('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await dbQuery('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(
  email: string, 
  password: string, 
  name: string = '', 
  role: string = 'author'
): Promise<User> {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await dbQuery(
    'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [email, hashedPassword, name, role]
  );
  return result.rows[0];
}

export async function updateUser(
  id: number,
  email: string,
  name: string,
  role: string
): Promise<User> {
  const result = await dbQuery(
    `UPDATE users SET email = $1, name = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
    [email, name, role, id]
  );
  return result.rows[0];
}

export async function updateUserPassword(id: number, password: string): Promise<void> {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  await dbQuery('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, id]);
}

export async function deleteUser(id: number): Promise<void> {
  await dbQuery('DELETE FROM users WHERE id = $1', [id]);
}

export async function getAllUsers(): Promise<User[]> {
  const result = await dbQuery('SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC');
  return result.rows;
}
