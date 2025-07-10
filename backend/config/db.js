import { neon } from "@neondatabase/serverless";

import "dotenv/config"

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);

// create a database
export const initDB = async () => {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        is_done BOOLEAN NOT NULL DEFAULT FALSE,
        due_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NULL
      )
    `;

        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Error initializing DB:", err);
        process.exit(1);
    }
};