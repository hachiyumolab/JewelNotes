import path from "path";
import { fileURLToPath } from "url";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


/* ============================================================
 * 🔧 ESM (import/export) では __dirname が自動で使えない。
 *    → import.meta.url（現在のファイルのURL）から
 *      fileURLToPath を使って “絶対パス” を取り出す。
 * ============================================================ */
const __filename = fileURLToPath(import.meta.url);


/* ============================================================
 * __dirname = このファイル(swagger.js)が置かれているフォルダの場所。
 * これが無いと apis: [...routes/*.js] のパスが組み立てられない。
 * ============================================================ */
const __dirname = path.dirname(__filename);


/* ============================================================
 * 📘 Swagger 設定オブジェクト
 *
 * “definition” → API の全体設定（OpenAPIバージョン、タイトルなど）
 * “components.schemas” → 共通で使うデータ型を定義（超重要）
 * “apis” → どのルートファイルに Swagger コメントがあるか
 *
 * 今回エラーが出ていた理由：
 *   - schemas が無かった
 *   - Entry や ServerError が定義されてなかった
 *   → だから `$ref: "#/components/schemas/Entry"` を見つけられず赤エラー
 * ============================================================ */
const options = {
    definition: {
        // OpenAPI バージョン（今は 3.0.0 が標準）
        openapi: "3.0.0",

        // API のメタデータ（Swagger UI の上に出るやつ）
        info: {
            title: "JewelNotes API",     // タイトル
            version: "1.0.0",            // バージョン
            description: "API documentation for JewelNotes", // 説明
        },

        /* ========================================================
         * 🧩 components.schemas
         *
         * Swagger の “共通部品置き場”
         * models / types / DTO みたいなもの。
         *
         * ルート（entryRoutes.js）で
         *   $ref: "#/components/schemas/Entry"
         * とか使うためには絶対ここに定義が必要。
         * ======================================================== */
        components: {
            schemas: {

                /* --------------------------------------------------
                 * 共通エラー構造（開発環境で使う errorHandler に合わせて定義）
                 * -------------------------------------------------- */
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "error" },
                        message: { type: "string", example: "Entry not found" },
                        code: { type: "integer", example: 404 },
                        stack: { type: "string", example: "stack trace (development only)" }
                    }
                },

                /* --------------------------------------------------
                 * 404 NotFound 用
                 * ErrorResponse をベースに message と code を上書き
                 * -------------------------------------------------- */
                NotFoundError: {
                    allOf: [
                        { $ref: "#/components/schemas/ErrorResponse" },
                        {
                            properties: {
                                message: { example: "Entry not found" },
                                code: { example: 404 }
                            }
                        }
                    ]
                },

                /* --------------------------------------------------
                 * 400 BadRequest（バリデーションエラーなど）
                 * -------------------------------------------------- */
                BadRequestError: {
                    allOf: [
                        { $ref: "#/components/schemas/ErrorResponse" },
                        {
                            properties: {
                                message: { example: "Invalid request body" },
                                code: { example: 400 }
                            }
                        }
                    ]
                },

                /* --------------------------------------------------
                 * 500 Internal Server Error
                 * -------------------------------------------------- */
                ServerError: {
                    allOf: [
                        { $ref: "#/components/schemas/ErrorResponse" },
                        {
                            properties: {
                                message: { example: "Internal server error" },
                                code: { example: 500 }
                            }
                        }
                    ]
                },

                /* --------------------------------------------------
                 * Entry レコードの構造（DBから返ってくる1件分）
                 * GET /entries や GET /entries/{id} のレスポンスとして利用
                 * -------------------------------------------------- */
                Entry: {
                    type: "object",
                    properties: {
                        entry_id: { type: "integer", example: 1 },
                        user_id: { type: "integer", example: 1 },
                        body: { type: "string", example: "サンプル本文" },
                        entry_datetime_utc: {
                            type: "string",
                            example: "2025-01-01T12:00:00Z"
                        },
                        created_at: {
                            type: "string",
                            example: "2025-01-01T12:00:00Z"
                        },
                        updated_at: {
                            type: "string",
                            example: "2025-01-01T12:00:00Z"
                        }
                    }
                },

                /* --------------------------------------------------
                 * EntryCreate（POST /entries のリクエストボディ用）
                 *
                 * ここが無いとルート側で
                 *   $ref: "#/components/schemas/EntryCreate"
                 * を参照した時に 100% エラーになる。
                 * -------------------------------------------------- */
                EntryCreate: {
                    type: "object",
                    properties: {
                        body: {
                            type: "string",
                            example: "今日のメモだよ！"
                        }
                    },
                    required: ["body"]  // body フィールドは必須
                }

            } // ← schemas 終わり
        } // ← components 終わり
    },

    /* ============================================================
     * 📌 Swagger が JSDoc コメントを読みに行く場所
     *
     * entryRoutes.js の
     *   /**
     *     @openapi
     *     /api/v1/entries:
     *       get:
     *         ...
     *   * /
     *
     * をここが解析して、UI に反映している。
     * ============================================================ */
    apis: [path.join(__dirname, "./v1/routes/*.js")],
};


/* ============================================================
 * swaggerSpec = ここまで作った options を元にした
 *                OpenAPI 仕様書の完成オブジェクト。
 * ============================================================ */
export const swaggerSpec = swaggerJSDoc(options);


/* ============================================================
 * Express に Swagger UI を表示させるための関数。
 * app.js で
 *    swaggerDocs(app)
 * と呼んでいる。
 * ============================================================ */
export function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}