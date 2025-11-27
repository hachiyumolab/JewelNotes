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
 */

import * as entryService from "../services/entryService.js";

/* ===========================================================
 * A: GET /entries
 * 全エントリ取得
 * =========================================================== */
export async function getAllEntries(req, res, next) {
    try {
        // Service 層へデータ取得の指示
        const entries = await entryService.listEntries();

        // 正常時 → 直接レスポンス
        res.json(entries);

    } catch (err) {
        /**
         * catch ではレスポンスを返さない
         * next(err) を呼ぶことで errorHandler.js に処理を委譲する
         */
        next(err);
    }
}

/* ===========================================================
 * C: GET /entries/:id
 * 単一エントリの取得
 * =========================================================== */
export async function getEntryById(req, res, next) {
    try {
        // URL パラメータを数値にキャスト
        const id = Number(req.params.id);

        // 取得処理
        const entry = await entryService.getEntry(id);

        /**
         * Service 層がデータ無しを ApiError.notFound() として投げれば、
         * Controller はここに来ず errorHandler に流れる。
         * よって Controller では 404 判定をしない。
         */
        res.json(entry);

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
        // body データを渡して新規作成
        const entry = await entryService.createEntry(req.body);

        // 201 Created で返す
        res.status(201).json(entry);

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

        const updated = await entryService.updateEntryFull(id, data);

        // updateEntryFull もデータ無しなら ApiError.notFound を投げる
        res.json(updated);

    } catch (err) {
        next(err);
    }
}

/* ===========================================================
 * E: PATCH /entries/:id
 * 一部更新
 * =========================================================== */
export async function patchEntry(req, res, next) {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const updated = await entryService.updateEntryPartial(id, data);

        res.json(updated);

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

        await entryService.deleteEntry(id);

        // 削除成功 → boolean ではなく成功メッセージ
        res.json({ success: true });

    } catch (err) {
        next(err);
    }
}