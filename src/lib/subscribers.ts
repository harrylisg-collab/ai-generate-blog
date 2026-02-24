import { query } from './db';

export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export async function createSubscriber(email: string): Promise<Subscriber> {
  const result = await query(
    'INSERT INTO subscribers (email) VALUES ($1) RETURNING *',
    [email]
  );
  return result.rows[0];
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const result = await query('SELECT * FROM subscribers WHERE email = $1', [email]);
  return result.rows[0] || null;
}
