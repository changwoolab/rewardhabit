"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directQuerying = void 0;
const secret_1 = require("../secret_modules/secret");
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: secret_1.DB_HOST,
    port: secret_1.DB_PORT,
    user: secret_1.DB_USERNAME,
    password: secret_1.DB_PASSWORD,
    database: secret_1.DB_NAME
});
const directQuerying = async (pstmt, data) => {
    const conn = await pool.getConnection();
    try {
        const sql = conn.format(pstmt, data);
        const [result] = await conn.query(sql);
        return result;
    }
    finally {
        conn.release();
    }
};
exports.directQuerying = directQuerying;
//# sourceMappingURL=directQuerying.js.map