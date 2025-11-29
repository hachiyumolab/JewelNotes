// src/services/entryService.js

/**
 * Service 層の役割：
 * ------------------------------------------
 * - DB に対する CRUD 処理を実行する
 * - "業務ロジック" をここで判断する
 * - Controller に返す前に「正常/異常」をここで確定させる
 * - 異常は ApiError を使って例外として投げる
 *
 * Controller は判断しない
 *   → 正常データを受け取って res.json に流すだけ
 *   → エラーは next(err) に渡すだけ
 *
 * errorHandler が JSON エラー形式を作る
 */

import { db } from "../db/index.js";
import ApiError from "../../errors/ApiError.js";

/* ===========================================================
 * A: List entries
 * =========================================================== */
export async function listEntries() {
  const query = `
    SELECT entry_id, user_id, body, entry_datetime_utc, created_at, updated_at
    FROM trn.trn_entry
    ORDER BY entry_id DESC
  `;

  // DBエラーは全て errorHandler に流れる
  const result = await db.query(query);
  return result.rows; // [] の場合はそのまま返す（正常）
}


/* ===========================================================
 * B: Create entry
 * =========================================================== */
export async function createEntry(data) {
  // 入力チェック（Zod導入前なので最低限）
  if (!data?.body || typeof data.body !== "string") {
    throw ApiError.badRequest("body is required");
  }

  const query = `
    INSERT INTO trn.trn_entry (user_id, body, entry_datetime_utc)
    VALUES ($1, $2, NOW())
    RETURNING *
  `;

  const result = await db.query(query, [1, data.body]);
  return result.rows[0]; // 作成されたデータ
}


/* ===========================================================
 * C: Get one
 * =========================================================== */
export async function getEntry(id) {
  // ID が数値でない場合
  if (!Number.isInteger(id)) {
    throw ApiError.badRequest("Invalid entry ID");
  }

  const query = `
    SELECT *
    FROM trn.trn_entry
    WHERE entry_id = $1
  `;

  const result = await db.query(query, [id]);
  const row = result.rows[0];

  if (!row) {
    // Service 層が 404 の責務を持つ
    throw ApiError.notFound("Entry not found");
  }

  return row;
}


/* ===========================================================
 * D: Full update (PUT)  ※完全上書き
 * =========================================================== */
export async function updateEntryFull(id, data) {
  if (!Number.isInteger(id)) {
    throw ApiError.badRequest("Invalid entry ID");
  }
  if (!data?.body) {
    throw ApiError.badRequest("body is required");
  }

  const query = `
    UPDATE trn.trn_entry
    SET body = $1,
        updated_at = NOW()
    WHERE entry_id = $2
    RETURNING *
  `;

  const result = await db.query(query, [data.body, id]);
  const row = result.rows[0];

  if (!row) {
    throw ApiError.notFound("Entry not found");
  }

  return row;
}


/* ===========================================================
 * E: Partial update (PATCH)
 * =========================================================== */
export async function updateEntryPartial(id, data) {
  if (!Number.isInteger(id)) {
    throw ApiError.badRequest("Invalid entry ID");
  }

  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${idx}`);
    values.push(value);
    idx++;
  }

  // 更新データが空なら 400
  if (fields.length === 0) {
    throw ApiError.badRequest("No fields to update");
  }

  const query = `
    UPDATE trn.trn_entry
    SET ${fields.join(", ")},
        updated_at = NOW()
    WHERE entry_id = $${idx}
    RETURNING *
  `;

  values.push(id);

  const result = await db.query(query, values);
  const row = result.rows[0];

  if (!row) {
    throw ApiError.notFound("Entry not found");
  }

  return row;
}


/* ===========================================================
 * F: Delete
 * =========================================================== */
export async function deleteEntry(id) {
  if (!Number.isInteger(id)) {
    throw ApiError.badRequest("Invalid entry ID");
  }

  const query = `
    DELETE FROM trn.trn_entry
    WHERE entry_id = $1
    RETURNING *
  `;

  const result = await db.query(query, [id]);
  const row = result.rows[0];

  if (!row) {
    throw ApiError.notFound("Entry not found");
  }

  return true; // Controller は {success: true} を返す
}
