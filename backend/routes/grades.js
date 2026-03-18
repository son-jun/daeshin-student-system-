// backend/routes/grades.js

const router = require("express").Router();
const db     = require("../config/db");
const authMW = require("../middleware/auth");
router.use(authMW);

// GET /api/grades — 내 전체 성적 조회 (가중 평균 포함)
router.get('/', async (req, res) => {
  const [grades] = await db.query(
    'SELECT * FROM grades WHERE user_id=?', [req.userId]
  );
  // 가중 평균 계산
  let totalUnits = 0, weightedSum = 0;
  grades.forEach(g => {
    if (g.units && g.grade_rank) {
      totalUnits  += g.units;
      weightedSum += g.units * g.grade_rank;
    }
  });
  const weighted_avg = totalUnits ? (weightedSum / totalUnits).toFixed(2) : null;
  res.json({ grades, weighted_avg, total_units: totalUnits });
});

// PUT /api/grades/:subject_id — 성적 저장
router.put('/:subject_id', async (req, res) => {
  const { units, raw_score, grade_rank, class_rank } = req.body;
  await db.query(
    `INSERT INTO grades (user_id, subject_id, units, raw_score, grade_rank, class_rank)
     VALUES (?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE
       units=VALUES(units), raw_score=VALUES(raw_score),
       grade_rank=VALUES(grade_rank), class_rank=VALUES(class_rank)`,
    [req.userId, req.params.subject_id, units||null, raw_score||null, grade_rank||null, class_rank]
  );
  res.json({ message: '성적 저장 완료' });
});

module.exports = router;
