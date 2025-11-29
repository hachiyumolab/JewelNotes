// -------------------------------------------------------------
// entryValidator.js
// -------------------------------------------------------------
// このファイルは、API が受け取るデータが「正しい形式か」を確認する。
// 今回は Zod というライブラリを使って、型と必須チェックをする。
// もし不正な値が来た場合は、ApiError を使って HTTP 400 を返す役割。
// -------------------------------------------------------------

import { z } from "zod";
import ApiError from "../errors/ApiError.js";

// -------------------------------------------------------------
// ★ EntryCreateSchema（POST /entries 用）
// -------------------------------------------------------------
const EntryCreateSchema = z.object({
    body: z
        .string()
        .min(1, "body is required"),
});

// -------------------------------------------------------------
// ★ EntryUpdateFullSchema（PUT /entries/:id 用）
// -------------------------------------------------------------
const EntryUpdateFullSchema = z.object({
    body: z
        .string()
        .min(1, "body is required"),
});

// -------------------------------------------------------------
// ★ EntryUpdatePartialSchema（PATCH /entries/:id 用）
// -------------------------------------------------------------
const EntryUpdatePartialSchema = z.object({
    body: z.string().optional(),
});

// -------------------------------------------------------------
// ★ IdSchema（URL パラメータ用）
// -------------------------------------------------------------
const IdSchema = z.number().int().positive();


// -------------------------------------------------------------
// validateEntryCreate
// -------------------------------------------------------------
export function validateEntryCreate(data) {
    const result = EntryCreateSchema.safeParse(data);

    if (!result.success) {
        throw ApiError.badRequest(result.error.errors[0].message);
    }

    return result.data;
}

// -------------------------------------------------------------
// validateEntryUpdateFull
// -------------------------------------------------------------
export function validateEntryUpdateFull(data) {
    const result = EntryUpdateFullSchema.safeParse(data);

    if (!result.success) {
        throw ApiError.badRequest(result.error.errors[0].message);
    }

    return result.data;
}

// -------------------------------------------------------------
// validateEntryUpdatePartial
// -------------------------------------------------------------
export function validateEntryUpdatePartial(data) {
    const result = EntryUpdatePartialSchema.safeParse(data);

    if (!result.success) {
        throw ApiError.badRequest(result.error.errors[0].message);
    }

    return result.data;
}

// -------------------------------------------------------------
// validateId
// -------------------------------------------------------------
export function validateId(id) {
    const num = Number(id);
    const result = IdSchema.safeParse(num);

    if (!result.success) {
        throw ApiError.badRequest("Invalid id");
    }

    return result.data;
}
