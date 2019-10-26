CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS games (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  width INT NOT NULL,
  height INT NOT NULL
);

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

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON games;
DROP TRIGGER IF EXISTS set_timestamp ON squares;

CREATE TRIGGER set_timestamp BEFORE UPDATE ON games
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp BEFORE UPDATE ON squares
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();