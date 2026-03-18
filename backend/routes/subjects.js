// backend/routes/subjects.js

const router  = require("express").Router();
const db      = require("../config/db");
const authMW  = require("../middleware/auth");

// 모든 라우트에 JWT 인증 적용
router.use(authMW);

// GET /api/subjects — 내 과목 목록 조회
router.get('/', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM subjects WHERE user_id=? ORDER BY sort_order ASC',
    [req.userId]
  );
  res.json(rows);
});

// POST /api/subjects — 과목 추가
router.post('/', async (req, res) => {
  const { subject_key, name, icon, sort_order } = req.body;
  const [result] = await db.query(
    'INSERT INTO subjects (user_id,subject_key,name,icon,sort_order) VALUES (?,?,?,?,?)',
    [req.userId, subject_key, name, icon || '', sort_order || 0]
  );
  res.status(201).json({ id: result.insertId, name });
});

// DELETE /api/subjects/:id — 과목 삭제 (CASCADE로 관련 데이터 자동 삭제)
router.delete('/:id', async (req, res) => {
  await db.query(
    'DELETE FROM subjects WHERE id=? AND user_id=?',
    [req.params.id, req.userId]
  );
  res.json({ message: '삭제 완료' });
});

module.exports = router;
