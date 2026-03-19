const mysql = require("mysql2");
 
const db = mysql.createPool({
  host:     process.env.DB_HOST     || "caboose.proxy.rlwy.net",
  port:     process.env.DB_PORT     || 51993,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "OTteZblDPzCoPINSBqzLXjEkJvvBycde",
  database: process.env.DB_NAME     || "railway",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});
 
// 서버 시작 시 연결 확인
db.getConnection((err, connection) => {
  if (err) {
    console.log("DB 연결 실패");
    console.log(err);
    return;
  }
  console.log("MySQL 연결 성공");
  connection.release();
});
 
module.exports = db;