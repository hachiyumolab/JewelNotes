// -------------------------------------------------------------
// src/controllers/entryController.js
// -------------------------------------------------------------
// これは API の「入口」を担当する層。
// Controller の責務は以下の4つだけ：
//
//   (1) HTTPリクエストを受け取る（params / query / body）
//   (2) バリデーションが必要ならここで呼ぶ（Zod）
//   (3) ビジネスロジックは Service 層に丸投げする
//   (4) 最終レスポンスを返す
//
// ⚠ Controller は DBアクセスやビジネスルールを持たない。
//    必ず Service 層に処理を渡すこと。
// -------------------------------------------------------------

// Service 層（DB操作 + 業務ロジック）を読み込み
import * as entryService from "../services/entryService.js";

// Zod のバリデーション関数を読み込み
// パスは「controllers → src → validators」なので ../validators が正解
import {
    validateEntryCreate,
    validateEntryUpdateFull,
    validateEntryUpdatePartial,
    validateId,
} from "../../validators/entryValidator.js";


// ==============================================================
// A: GET /entries  （全取得）
// ==============================================================
export async function getAllEntries(req, res, next) {
    try {
        // Service 層にデータ取得を依頼
        const entries = await entryService.listEntries();

        // 統一レスポンス形式
        res.json({
            status: "success",
            data: entries,
        });
    } catch (err) {
        next(err);
    }
}


// ==============================================================
// C: GET /entries/:id  （単一取得）
// ==============================================================
export async function getEntryById(req, res, next) {
    try {
        // ① id をバリデート（数値/整数/正の数）
        const id = validateId(req.params.id);

        // ② Service 層で取得（見つからない時は 404 を throw）
        const entry = await entryService.getEntry(id);

        // ③ 成功レスポンス
        res.json({
            status: "success",
            data: entry,
        });
    } catch (err) {
        next(err);
    }
}


// ==============================================================
// B: POST /entries  （新規作成）
// ==============================================================
export async function postEntry(req, res, next) {
    try {
        // ① リクエストボディを Zod で検証
        const validatedData = validateEntryCreate(req.body);

        // ②Service 層に「作成」を依頼
        const entry = await entryService.createEntry(validatedData);

        // ③ 成功レスポンス（201 Created）
        res.status(201).json({
            status: "success",
            data: entry,
        });
    } catch (err) {
        next(err);
    }
}


// ==============================================================
// D: PUT /entries/:id  （全更新）
// ==============================================================
export async function putEntry(req, res, next) {
    try {
        // ① id を Zod で検証
        const id = validateId(req.params.id);

        // ② body 全更新の Zod 検証
        const validatedData = validateEntryUpdateFull(req.body);

        // ③ 更新処理
        const updated = await entryService.updateEntryFull(id, validatedData);

        // ④ 統一レスポンス
        res.json({
            status: "success",
            data: updated,
        });
    } catch (err) {
        next(err);
    }
}


// ==============================================================
// E: PATCH /entries/:id  （部分更新）
// ==============================================================
export async function patchEntry(req, res, next) {
    try {
        // ① id 検証
        const id = validateId(req.params.id);

        // ② 部分更新の Zod 検証（任意項目 + 型チェック）
        const validatedData = validateEntryUpdatePartial(req.body);

        // ③ 更新処理
        const updated = await entryService.updateEntryPartial(id, validatedData);

        // ④ レスポンス
        res.json({
            status: "success",
            data: updated,
        });
    } catch (err) {
        next(err);
    }
}


// ==============================================================
// F: DELETE /entries/:id  （削除）
// ==============================================================
export async function deleteEntry(req, res, next) {
    try {
        // ① id 検証
        const id = validateId(req.params.id);

        // ② 削除を依頼
        await entryService.deleteEntry(id);

        // ③ メッセージ型レスポンス
        res.json({
            status: "success",
            message: "deleted",
        });
    } catch (err) {
        next(err);
    }
}
