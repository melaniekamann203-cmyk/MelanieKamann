-- Bitácora API: estructura de la base de datos
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL CHECK (char_length(trim(name)) > 0),
  email       VARCHAR(150) NOT NULL UNIQUE,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  author_id   INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL CHECK (char_length(trim(title)) > 0),
  content     TEXT NOT NULL,
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX posts_author_id_idx ON posts (author_id);
CREATE INDEX posts_published_idx ON posts (published);
