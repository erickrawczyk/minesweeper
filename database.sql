-- This script will initialize a PSQL database for use with the minesweeper application
-- It should be idempotent, but something like Flyway may be more useful for future changes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Game Result enum type
DO $$ BEGIN
    CREATE TYPE game_result AS ENUM ('WON', 'LOST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  width INT NOT NULL,
  height INT NOT NULL,
  result game_result
);

-- Create squares table
CREATE TABLE IF NOT EXISTS squares (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  selected BOOLEAN NOT NULL DEFAULT FALSE,
  has_bomb BOOLEAN NOT NULL,
  x INT NOT NULL,
  y INT NOT NULL
);

-- Create function to change the modified_at timestamp on update
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remove and re-add the modified trigger to the games and squares tables
DROP TRIGGER IF EXISTS set_timestamp ON games;
DROP TRIGGER IF EXISTS set_timestamp ON squares;

CREATE TRIGGER set_timestamp BEFORE UPDATE ON games
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp BEFORE UPDATE ON squares
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();