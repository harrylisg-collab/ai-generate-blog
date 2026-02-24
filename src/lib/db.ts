import { Pool } from 'pg';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Use test database for preview/development, production database for production
const getConnectionString = () => {
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
  
  if (env === 'production') {
    return process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  }
  
  // For preview/development, use test database if available
  return process.env.TEST_POSTGRES_URL_NON_POOLING || process.env.TEST_POSTGRES_URL 
    || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
};

const pool = new Pool({
  connectionString: getConnectionString(),
  ssl: { rejectUnauthorized: false }
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function createTables() {
  // Create users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create posts table with tags and author
  await query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      tags TEXT[] DEFAULT '{}',
      author VARCHAR(255) DEFAULT 'Admin',
      published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add missing columns if they don't exist
  try {
    await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';`);
  } catch (e) {
    // Column might already exist
  }
  
  try {
    await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Admin';`);
  } catch (e) {
    // Column might already exist
  }

  // Create subscribers table for newsletter
  await query(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables created/migrated successfully');
}

// Initialize tables - will be called on first run
createTables().catch(console.error);
