-- Create users table (if not using Supabase Auth users table)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL
);

-- Create conversation_sessions table
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id text PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  persona_id VARCHAR(64),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INTEGER,
  transcript TEXT,
  mood VARCHAR(32)
);

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
  session_id text REFERENCES conversation_sessions(id),
  exercise_id uuid REFERENCES exercises(id),
  completed_at TIMESTAMP DEFAULT now()
);

-- Create payments table for Stripe subscription integration
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT,
  amount INTEGER,
  currency TEXT,
  created_at TIMESTAMP DEFAULT now()
);
