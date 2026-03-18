// backend/routes/assessments.js

const router = require("express").Router();
const db     = require("../config/db");
const authMW = require("../middleware/auth");
router.use(authMW);

// GET /api/assessments?subject_id=X
router.get('/', async (req, res) => {
  const { subject_id } = req.query;
  let sql  = 'SELECT a.*, GROUP_CONCAT(i.image_data) as images_raw FROM assessments a'
           + ' LEFT JOIN assessment_images i ON i.assessment_id=a.id'
           + ' WHERE a.user_id=?';
  const params = [req.userId];
  if (subject_id) { sql += ' AND a.subject_id=?'; params.push(subject_id); }
  sql += ' GROUP BY a.id ORDER BY a.due_date ASC';
  const [rows] = await db.query(sql, params);
  res.json(rows);
});

// POST /api/assessments — 수행평가 등록
router.post('/', async (req, res) => {
  const { subject_id, title, due_date, type, score_info, description, images } = req.body;
  const [result] = await db.query(
    'INSERT INTO assessments (user_id,subject_id,title,due_date,type,score_info,description) VALUES (?,?,?,?,?,?,?)',
    [req.userId, subject_id, title, due_date||null, type, score_info, description]
  );
  const asmId = result.insertId;
  // 이미지 저장
  if (images && images.length) {
    for (let i = 0; i < images.length; i++) {
      await db.query(
        'INSERT INTO assessment_images (assessment_id, image_data, file_name, sort_order) VALUES (?,?,?,?)',
        [asmId, images[i].dataUrl, images[i].name, i]
      );
    }
  }
  res.status(201).json({ id: asmId });
});

// PATCH /api/assessments/:id/done — 완료 토글
router.patch('/:id/done', async (req, res) => {
  await db.query(
    'UPDATE assessments SET is_done = NOT is_done WHERE id=? AND user_id=?',
    [req.params.id, req.userId]
  );
  res.json({ message: '상태 변경 완료' });
});

// DELETE /api/assessments/:id
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM assessments WHERE id=? AND user_id=?',
    [req.params.id, req.userId]);
  res.json({ message: '삭제 완료' });
});

module.exports = router;
