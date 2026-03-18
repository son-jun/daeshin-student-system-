-- DSS 데이터베이스 초기화 스크립트
-- 실행: mysql -u root -p < database/init.sql

CREATE DATABASE IF NOT EXISTS daeshin_student_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE daeshin_student_db;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  login_id      VARCHAR(50)  NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  name          VARCHAR(50)  NOT NULL,
  school        VARCHAR(100),
  grade         TINYINT,
  class_number  VARCHAR(20),
  avatar_data   LONGTEXT,
  created_at    DATETIME DEFAULT NOW(),
  updated_at    DATETIME ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  subject_key VARCHAR(30) NOT NULL,
  name        VARCHAR(50) NOT NULL,
  icon        VARCHAR(10),
  sort_order  INT DEFAULT 0,
  is_default  TINYINT(1) DEFAULT 1,
  created_at  DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  subject_id  INT NOT NULL,
  content     LONGTEXT,
  char_count  INT DEFAULT 0,
  updated_at  DATETIME ON UPDATE NOW(),
  UNIQUE KEY uq_user_subject (user_id, subject_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  subject_id  INT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  due_date    DATE,
  type        VARCHAR(30),
  score_info  VARCHAR(100),
  description TEXT,
  is_done     TINYINT(1) DEFAULT 0,
  created_at  DATETIME DEFAULT NOW(),
  updated_at  DATETIME ON UPDATE NOW(),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessment_images (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id  INT NOT NULL,
  image_data     LONGTEXT NOT NULL,
  file_name      VARCHAR(255),
  sort_order     INT DEFAULT 0,
  created_at     DATETIME DEFAULT NOW(),
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grades (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  subject_id  INT NOT NULL,
  units       TINYINT,
  raw_score   DECIMAL(5,2),
  grade_rank  TINYINT,
  class_rank  VARCHAR(20),
  updated_at  DATETIME ON UPDATE NOW(),
  UNIQUE KEY uq_user_subject_grade (user_id, subject_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
