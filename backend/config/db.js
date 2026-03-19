// backend/config/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "••••••••••••••••••••••••••••••••",
  database: process.env.DB_NAME || "daeshin_student_db",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
});

// ✅ 연결 테스트 (서버 시작 시 1회 실행)
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL 연결 성공");

    // 🔥 진짜 연결 확인용 쿼리
    const [rows] = await conn.query("SELECT 1 AS test");
    console.log("쿼리 테스트:", rows);

    conn.release();
  } catch (err) {
    console.error("❌ MySQL 연결 실패:", err.message);
  }
})();

module.exports = pool;