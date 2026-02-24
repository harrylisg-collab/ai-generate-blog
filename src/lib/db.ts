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

export async function migrate() {
  console.log('Running database migration...');
  
  // Create users table
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'author',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table ready');
  } catch (e: any) {
    console.error('Users table error:', e.message);
  }

  // Add missing columns to users
  try {
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);`);
  } catch (e) { /* ignore */ }
  
  try {
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'author';`);
  } catch (e) { /* ignore */ }

  // Create posts table
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        tags TEXT[] DEFAULT '{}',
        author VARCHAR(255) DEFAULT 'Admin',
        author_id INTEGER REFERENCES users(id),
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Posts table ready');
  } catch (e: any) {
    console.error('Posts table error:', e.message);
  }

  // Add missing columns to posts
  try {
    await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES users(id);`);
  } catch (e) { /* ignore */ }
  try {
    await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';`);
  } catch (e) { /* ignore */ }
  try {
    await query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Admin';`);
  } catch (e) { /* ignore */ }

  // Create subscribers table
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Subscribers table ready');
  } catch (e: any) {
    console.error('Subscribers table error:', e.message);
  }

  console.log('Migration complete');
}

// Run migration on startup
migrate().catch(console.error);

