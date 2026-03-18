// backend/routes/notes.js

const router = require("express").Router();
const db     = require("../config/db");
const authMW = require("../middleware/auth");
router.use(authMW);

// GET /api/notes/:subject_id
router.get('/:subject_id', async (req, res) => {
  const [rows] = await db.query(
    'SELECT content, char_count, updated_at FROM notes WHERE user_id=? AND subject_id=?',
    [req.userId, req.params.subject_id]
  );
  res.json(rows[0] || { content: '', char_count: 0 });
});

// PUT /api/notes/:subject_id — 저장 (없으면 생성, 있으면 수정)
router.put('/:subject_id', async (req, res) => {
  const { content } = req.body;
  const char_count  = content ? content.length : 0;
  await db.query(
    `INSERT INTO notes (user_id, subject_id, content, char_count)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE content=VALUES(content), char_count=VALUES(char_count)`,
    [req.userId, req.params.subject_id, content, char_count]
  );
  res.json({ message: '저장 완료', char_count });
});

module.exports = router;
