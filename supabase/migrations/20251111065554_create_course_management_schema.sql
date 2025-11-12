/*
  # Course Management System Database Schema

  ## Overview
  Creates a comprehensive database schema for a course management system with role-based access control.

  ## New Tables
  
  ### 1. profiles
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `full_name` (text)
  - `role` (text, not null) - 'student' or 'teacher'
  - `avatar_url` (text)
  - `bio` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. courses
  - `id` (uuid, primary key)
  - `teacher_id` (uuid, references profiles)
  - `title` (text, not null)
  - `description` (text)
  - `image_url` (text)
  - `category` (text)
  - `duration` (text)
  - `level` (text) - 'beginner', 'intermediate', 'advanced'
  - `is_published` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. course_modules
  - `id` (uuid, primary key)
  - `course_id` (uuid, references courses)
  - `title` (text, not null)
  - `description` (text)
  - `order_index` (integer, not null)
  - `created_at` (timestamptz)

  ### 4. lessons
  - `id` (uuid, primary key)
  - `module_id` (uuid, references course_modules)
  - `title` (text, not null)
  - `content` (text)
  - `video_url` (text)
  - `order_index` (integer, not null)
  - `duration_minutes` (integer)
  - `created_at` (timestamptz)

  ### 5. enrollments
  - `id` (uuid, primary key)
  - `student_id` (uuid, references profiles)
  - `course_id` (uuid, references courses)
  - `enrolled_at` (timestamptz)
  - `progress` (integer, default 0) - percentage 0-100
  - `completed_at` (timestamptz, nullable)

  ### 6. assignments
  - `id` (uuid, primary key)
  - `course_id` (uuid, references courses)
  - `title` (text, not null)
  - `description` (text)
  - `due_date` (timestamptz)
  - `max_score` (integer, default 100)
  - `created_at` (timestamptz)

  ### 7. assignment_submissions
  - `id` (uuid, primary key)
  - `assignment_id` (uuid, references assignments)
  - `student_id` (uuid, references profiles)
  - `content` (text)
  - `file_url` (text)
  - `submitted_at` (timestamptz)
  - `score` (integer, nullable)
  - `feedback` (text)
  - `graded_at` (timestamptz, nullable)

  ### 8. quizzes
  - `id` (uuid, primary key)
  - `course_id` (uuid, references courses)
  - `title` (text, not null)
  - `description` (text)
  - `time_limit_minutes` (integer)
  - `passing_score` (integer, default 70)
  - `created_at` (timestamptz)

  ### 9. quiz_questions
  - `id` (uuid, primary key)
  - `quiz_id` (uuid, references quizzes)
  - `question_text` (text, not null)
  - `question_type` (text, not null) - 'multiple_choice', 'true_false', 'short_answer'
  - `options` (jsonb) - for multiple choice
  - `correct_answer` (text, not null)
  - `points` (integer, default 1)
  - `order_index` (integer, not null)

  ### 10. quiz_attempts
  - `id` (uuid, primary key)
  - `quiz_id` (uuid, references quizzes)
  - `student_id` (uuid, references profiles)
  - `answers` (jsonb)
  - `score` (integer)
  - `started_at` (timestamptz)
  - `completed_at` (timestamptz, nullable)

  ## Security
  - Enable RLS on all tables
  - Policies ensure students can only access their own data
  - Teachers can manage their own courses
  - Public can view published courses
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('student', 'teacher')),
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  category text,
  duration text,
  level text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = true OR teacher_id = auth.uid());

CREATE POLICY "Teachers can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (teacher_id = auth.uid());

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules of published courses"
  ON course_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND (courses.is_published = true OR courses.teacher_id = auth.uid())
    )
  );

CREATE POLICY "Teachers can manage modules of own courses"
  ON course_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  video_url text,
  order_index integer NOT NULL,
  duration_minutes integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons of published courses"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM course_modules
      JOIN courses ON courses.id = course_modules.course_id
      WHERE course_modules.id = lessons.module_id
      AND (courses.is_published = true OR courses.teacher_id = auth.uid())
    )
  );

CREATE POLICY "Teachers can manage lessons of own courses"
  ON lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules
      JOIN courses ON courses.id = course_modules.course_id
      WHERE course_modules.id = lessons.module_id
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_modules
      JOIN courses ON courses.id = course_modules.course_id
      WHERE course_modules.id = lessons.module_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at timestamptz,
  UNIQUE(student_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view enrollments in their courses"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll in courses"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own enrollment progress"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  max_score integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students can view assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = assignments.course_id
      AND enrollments.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage assignments in own courses"
  ON assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = assignments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Create assignment_submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text,
  file_url text,
  submitted_at timestamptz DEFAULT now(),
  score integer CHECK (score >= 0),
  feedback text,
  graded_at timestamptz,
  UNIQUE(assignment_id, student_id)
);

ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions"
  ON assignment_submissions FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view submissions in their courses"
  ON assignment_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN courses ON courses.id = assignments.course_id
      WHERE assignments.id = assignment_submissions.assignment_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit assignments"
  ON assignment_submissions FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own submissions"
  ON assignment_submissions FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() AND graded_at IS NULL)
  WITH CHECK (student_id = auth.uid() AND graded_at IS NULL);

CREATE POLICY "Teachers can grade submissions"
  ON assignment_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN courses ON courses.id = assignments.course_id
      WHERE assignments.id = assignment_submissions.assignment_id
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN courses ON courses.id = assignments.course_id
      WHERE assignments.id = assignment_submissions.assignment_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  time_limit_minutes integer,
  passing_score integer DEFAULT 70,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students can view quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = quizzes.course_id
      AND enrollments.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage quizzes in own courses"
  ON quizzes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = quizzes.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options jsonb,
  correct_answer text NOT NULL,
  points integer DEFAULT 1,
  order_index integer NOT NULL
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN enrollments ON enrollments.course_id = quizzes.course_id
      WHERE quizzes.id = quiz_questions.quiz_id
      AND enrollments.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN courses ON courses.id = quizzes.course_id
      WHERE quizzes.id = quiz_questions.quiz_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage quiz questions in own courses"
  ON quiz_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN courses ON courses.id = quizzes.course_id
      WHERE quizzes.id = quiz_questions.quiz_id
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN courses ON courses.id = quizzes.course_id
      WHERE quizzes.id = quiz_questions.quiz_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  answers jsonb,
  score integer,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view quiz attempts in their courses"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN courses ON courses.id = quizzes.course_id
      WHERE quizzes.id = quiz_attempts.quiz_id
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can create quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own quiz attempts"
  ON quiz_attempts FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
