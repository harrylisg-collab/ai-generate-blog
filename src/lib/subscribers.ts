import { query as dbQuery } from './db';

export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export async function createSubscriber(email: string): Promise<Subscriber> {
  const result = await dbQuery(
    'INSERT INTO subscribers (email) VALUES ($1) RETURNING *',
    [email]
  );
  return result.rows[0];
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const result = await dbQuery('SELECT * FROM subscribers WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const result = await dbQuery('SELECT * FROM subscribers ORDER BY created_at DESC');
  return result.rows;
}
