import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

const email = process.argv[2] || 'admin@example.com';
const password = process.argv[3] || 'admin123';

async function setupAdmin() {
  console.log(`Creating admin user: ${email}`);
  
  // Create tables first
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Insert or update user
  await sql`
    INSERT INTO users (email, password)
    VALUES (${email}, ${hashedPassword})
    ON CONFLICT (email) DO UPDATE SET password = ${hashedPassword}
  `;
  
  console.log(`Admin user created/updated: ${email}`);
  console.log(`Password: ${password}`);
  
  process.exit(0);
}

setupAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
