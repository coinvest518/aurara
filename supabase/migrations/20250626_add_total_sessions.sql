-- Add total_sessions column to user_usage table
ALTER TABLE user_usage ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_usage_total_sessions ON user_usage(user_id, total_sessions);

-- Update existing records
UPDATE user_usage 
SET total_sessions = (
    SELECT COUNT(*) 
    FROM user_usage u2 
    WHERE u2.user_id = user_usage.user_id
);
