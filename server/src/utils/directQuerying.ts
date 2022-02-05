import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
} from "../secret_modules/constants";
import mysql from "mysql2/promise";

// mysql Connection, 여러 column들을 select하는 sql 처리 위해 사용
// (Typeorm은 2~4개밖에 선택이 안되더라...ㅜㅜ)
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export const directQuerying = async (pstmt: string, data: string[]) => {
  const conn = await pool.getConnection();
  try {
    const sql = conn.format(pstmt, data);
    const [result] = await conn.query(sql);
    return result;
  } finally {
    conn.release();
  }
};
