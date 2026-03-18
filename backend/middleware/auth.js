// backend/middleware/auth.js

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Authorization: Bearer <token>
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증 토큰이 없습니다.' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId   = decoded.userId;   // 이후 라우터에서 req.userId 사용 가능
    next();
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
};
