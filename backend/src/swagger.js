import path from "path";
import { fileURLToPath } from "url";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// ESM 用 __dirname 再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger 設定
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: "JewelNotes API",
        version: "1.0.0",
        description: "API documentation for JewelNotes",
        },
    },
    apis: [path.join(__dirname, "v1/routes/*.js")],
};

// 仕様オブジェクト
export const swaggerSpec = swaggerJSDoc(options);

// Express に Swagger UI を提供する関数
export function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
