import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

export const db = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
