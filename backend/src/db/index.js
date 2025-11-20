import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

export const db = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

export async function connectDB() {
    try {
        await db.connect();
        console.log("✓ DB connected");
    } catch (err) {
        console.error("✗ DB connection failed:", err);
        process.exit(1);
    }
}
