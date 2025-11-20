import { db } from "../db/index.js";

export async function listEntries() {
    const query = `
        SELECT entry_id, user_id, body, entry_datetime_utc, created_at, updated_at
        FROM trn.trn_entry
        ORDER BY entry_id DESC
    `;
    const result = await db.query(query);
    return result.rows;
}

export async function createEntry(data) {
    const query = `
        INSERT INTO trn.trn_entry (user_id, body, entry_datetime_utc)
        VALUES ($1, $2, NOW())
        RETURNING *
    `;

    const result = await db.query(query, [1, data.body]);
    return result.rows[0];
}
