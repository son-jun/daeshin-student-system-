// backend/routes/auth.js

const router  = require("express").Router();
const db      = require("../config/db");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

// ── 회원가입 POST /api/auth/register ──
router.post('/register', async (req, res) => {
  const { login_id, password, name, school, grade, class_number } = req.body;
  if (!login_id || !password || !name) {
    return res.status(400).json({ error: '필수 항목을 입력하세요.' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);  // 비밀번호 해시화
    await db.query(
      'INSERT INTO users (login_id,password,name,school,grade,class_number) VALUES (?,?,?,?,?,?)',
      [login_id, hashed, name, school, grade, class_number]
    );
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: '이미 사용 중인 아이디입니다.' });
    res.status(500).json({ error: '서버 오류' });
  }
});

// ── 로그인 POST /api/auth/login ───────
router.post('/login', async (req, res) => {
  const { login_id, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE login_id=?', [login_id]);
    if (!rows.length) return res.status(401).json({ error: '아이디 또는 비밀번호 오류' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: '아이디 또는 비밀번호 오류' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, school: user.school,
              grade: user.grade, class_number: user.class_number }
    });
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
