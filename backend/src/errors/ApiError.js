// errors/ApiError.js

/**
 * ApiError クラスは「HTTP エラーを表すための独自例外」。
 * - Service や Controller 層で throw して使う
 * - statusCode（HTTPコード）と message を必ず持つ
 * - 原因となるエラー (cause) も保持できる
 * 
 * これを使うことで：
 * - バラバラなエラーメッセージを統一できる
 * - errorHandler.js による共通レスポンス処理が可能になる
 * 
 * Node.js の Error クラスを継承しているので、通常の throw に完全対応。
 */
export default class ApiError extends Error {

    /**
     * コンストラクタ
     * @param {number} statusCode - HTTP ステータスコード（例：404, 500）
     * @param {string} message - エラーメッセージ
     * @param {object} options - 追加オプション（cause など）
     */
    constructor(statusCode, message, options = {}) {
        // Error(message) を呼び出して "message" プロパティをセット
        super(message);

        // HTTP ステータスコードを保持
        this.statusCode = statusCode;

        // Node18+ の Error cause 機能を使って、元のエラーを保存
        if (options.cause) {
        this.cause = options.cause;
        }

        // isOperational は「予期された業務エラーか？」のフラグ
        // ※予期しない 500 エラーと区別するために使える
        this.isOperational = options.isOperational ?? true;

        // Error の stack trace をこのクラス名基準で生成
        Error.captureStackTrace(this, this.constructor);
    }

    // ---- 静的メソッド：業務アプリ用の便利関数 ----

    /** 400 Bad Request */
    static badRequest(msg) {
        return new ApiError(400, msg);
    }

    /** 401 Unauthorized */
    static unauthorized(msg) {
        return new ApiError(401, msg);
    }

    /** 403 Forbidden */
    static forbidden(msg) {
        return new ApiError(403, msg);
    }

    /** 404 Not Found */
    static notFound(msg) {
        return new ApiError(404, msg);
    }

    /** 500 Internal Server Error */
    static internal(msg = "Internal Server Error") {
        // isOperational=false を明確化（想定外エラーとして扱う）
        return new ApiError(500, msg, { isOperational: false });
    }
}
