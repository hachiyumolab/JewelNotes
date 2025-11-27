// errors/errorHandler.js

/**
 * グローバルエラーハンドリングミドルウェア。
 * 
 * Express のミドルウェアは (err, req, res, next) の4引数があると
 * 「これはエラーハンドラだ」と認識される。
 *
 * 役割：
 * - ApiError（アプリ側が意図して投げた例外）を綺麗に JSON で返す
 * - 想定外エラー（TypeError, SyntaxError など）は 500 として処理
 * - 本番では stack trace を隠し、開発では stack trace を返す
 */

import ApiError from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
    /**
     * 1) ApiError のインスタンスか？
     *   → 開発者が throw ApiError.notFound(...) のように投げた場合
     *   → HTTP ステータスコードとメッセージをそのまま返す
     */
    if (err instanceof ApiError) {
        const response = {
        status: "error",      // フロント側で「エラー」を認識しやすい形式
        message: err.message, // 開発者が指定したメッセージ
        };

        // 開発環境なら stack trace と cause を表示
        if (process.env.NODE_ENV !== "production") {
        // エラーがどこで発生したか追跡しやすくなる
        response.stack = err.stack;
        response.cause = err.cause;
        }

        return res.status(err.statusCode).json(response);
    }

    /**
     * 2) 想定外のエラー（TypeError / DB エラー / バグ etc.）
     *    - ApiError ではない通常の Error
     *    - 500 Internal Server Error として扱う
     *    - ここは「予期してないバグ」が来る
     */
    console.error(err); // サーバ側ログに出力（重要）

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error", // フロントに余計な情報を出さない
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};

// ESM の default export（import errorHandler from "..." で読める）
export default errorHandler;
