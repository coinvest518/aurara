-- Add mood column to conversation_sessions table
ALTER TABLE conversation_sessions ADD COLUMN mood VARCHAR(32);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  mood_tag VARCHAR(32),
  image_url TEXT
);

-- Create exercise_completions table
CREATE TABLE IF NOT EXISTS exercise_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  session_id uuid REFERENCES conversation_sessions(id),
  exercise_id uuid REFERENCES exercises(id),
  completed_at TIMESTAMP DEFAULT now()
);
