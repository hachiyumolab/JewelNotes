// src/controllers/entryController.js

/**
 * Controller 層の役割：
 * ------------------------------------------
 * - HTTP リクエスト（パラメータ/Body）を受け取る
 * - Service 層に処理を依頼する
 * - 結果を JSON として返す
 * - エラーは判断しない。catch で next(err) に渡すだけ
 *
 * なぜ判断しないのか？
 *  → 業務ルールの判断は Service 層が担当
 *  → エラーの形を統一するのは errorHandler.js が担当
 *  → Controller はテクニカル層（I/O担当）なので責務を持たない
 *
 * A-3 成功レスポンス統一ルール：
 * -------------------------------------
 * {
 *   "status": "success",
 *   "data": ... または "message": ...
 * }
 * 
 * エラーは ApiError → next(err) → errorHandler に流すので
 * ここでは「成功レスポンスの形」だけ統一すればOK。
 */

import * as entryService from "../services/entryService.js";

/* ===========================================================
 * A: GET /entries
 * 全エントリ取得
 * =========================================================== */
export async function getAllEntries(req, res, next) {
    try {
        // Service 層へ「全件取得」の処理を依頼
        const entries = await entryService.listEntries();

        /**
         * A-3 成功レスポンス統一仕様：
         * {
         *   "status": "success",
         *   "data": [...]
         * }
         */
        res.json({
            status: "success",
            data: entries,
        });

    } catch (err) {
        /**
         * ここではレスポンスを返さない。
         * next(err) を呼ぶ → errorHandler.js が最終レスポンスを担当。
         */
        next(err);
    }
}

/* ===========================================================
 * C: GET /entries/:id
 * 単一エントリ取得
 * =========================================================== */
export async function getEntryById(req, res, next) {
    try {
        // URLの :id を数値に変換（DBは数値型を要求する）
        const id = Number(req.params.id);

        // Service 層で 404 判定 & ApiError 投げが行われる
        const entry = await entryService.getEntry(id);

        // 成功レスポンス仕様（A-3）
        res.json({
            status: "success",
            data: entry,
        });

    } catch (err) {
        next(err);
    }
}

/* ===========================================================
 * B: POST /entries
 * 新規エントリ作成
 * =========================================================== */
export async function postEntry(req, res, next) {
    try {
        // Service 層に作成処理を依頼
        const entry = await entryService.createEntry(req.body);

        /**
         * 201 Created を返す。
         * A-3 成功レスポンス構造を適用。
         */
        res.status(201).json({
            status: "success",
            data: entry,
        });

    } catch (err) {
        next(err);
    }
}

/* ===========================================================
 * D: PUT /entries/:id
 * エントリの全更新（上書き）
 * =========================================================== */
export async function putEntry(req, res, next) {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        // データ無しなら Service 層が ApiError.notFound を throw
        const updated = await entryService.updateEntryFull(id, data);

        res.json({
            status: "success",
            data: updated,
        });

    } catch (err) {
        next(err);
    }
}

/* ===========================================================
 * E: PATCH /entries/:id
 * 一部フィールドの部分更新
 * =========================================================== */
export async function patchEntry(req, res, next) {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const updated = await entryService.updateEntryPartial(id, data);

        res.json({
            status: "success",
            data: updated,
        });

    } catch (err) {
        next(err);
    }
}

/* ===========================================================
 * F: DELETE /entries/:id
 * 削除
 * =========================================================== */
export async function deleteEntry(req, res, next) {
    try {
        const id = Number(req.params.id);

        // 削除処理。見つからなければ ApiError.notFound が飛ぶ。
        await entryService.deleteEntry(id);

        /**
         * DELETE は data ではなく message を返す。
         * 成功レスポンス統一仕様：
         * {
         *   "status": "success",
         *   "message": "deleted"
         * }
         */
        res.json({
            status: "success",
            message: "deleted",
        });

    } catch (err) {
        next(err);
    }
}
