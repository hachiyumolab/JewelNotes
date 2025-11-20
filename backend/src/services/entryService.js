// src/services/entryService.js
import { db } from "../db/index.js";

/* A: List entries */
export async function listEntries() {
    const query = `
        SELECT entry_id, user_id, body, entry_datetime_utc, created_at, updated_at
        FROM trn.trn_entry
        ORDER BY entry_id DESC
    `;
    const result = await db.query(query);
    return result.rows;
}

/* B: Create entry */
export async function createEntry(data) {
    const query = `
        INSERT INTO trn.trn_entry (user_id, body, entry_datetime_utc)
        VALUES ($1, $2, NOW())
        RETURNING *
    `;
    const result = await db.query(query, [1, data.body]);
    return result.rows[0];
}

/* C: Get one */
export async function getEntry(id) {
    const query = `
        SELECT *
        FROM trn.trn_entry
        WHERE entry_id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
}

/* D: Full update (PUT) */
export async function updateEntryFull(id, data) {
    const query = `
        UPDATE trn.trn_entry
        SET
            body = $1,
            updated_at = NOW()
        WHERE entry_id = $2
        RETURNING *
    `;
    const result = await db.query(query, [data.body, id]);
    return result.rows[0];
}

/* E: Partial update (PATCH) */
export async function updateEntryPartial(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    // 動的に更新フィールドを組み立てる
    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
    }

    // 更新対象が一つもなければ null を返す
    if (fields.length === 0) return null;

    const query = `
        UPDATE trn.trn_entry
        SET ${fields.join(", ")},
            updated_at = NOW()
        WHERE entry_id = $${idx}
        RETURNING *
    `;

    values.push(id);

    const result = await db.query(query, values);
    return result.rows[0];
}

/* F: Delete */
export async function deleteEntry(id) {
    const query = `
        DELETE FROM trn.trn_entry
        WHERE entry_id = $1
        RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
}