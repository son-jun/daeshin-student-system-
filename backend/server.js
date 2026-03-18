require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const authRouter        = require("./routes/auth");
const subjectsRouter    = require("./routes/subjects");
const notesRouter       = require("./routes/notes");
const assessmentsRouter = require("./routes/assessments");
const gradesRouter      = require("./routes/grades");

const app  = express();
const PORT = process.env.PORT || 3000;  // Railway가 PORT를 자동으로 넣어줌

app.use(cors());
app.use(express.json({ limit: "10mb" })); // 이미지 첨부 때문에 limit 필요
app.use(express.urlencoded({ extended: true }));

// 프런트엔드 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../frontend")));

// API 라우터 연결
app.use("/api/auth",        authRouter);
app.use("/api/subjects",    subjectsRouter);
app.use("/api/notes",       notesRouter);
app.use("/api/assessments", assessmentsRouter);
app.use("/api/grades",      gradesRouter);

// 새로고침해도 index.html 반환
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});

require('dotenv').config();