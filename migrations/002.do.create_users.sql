CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  username TEXT NOT NULL, 
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE posts
  ADD COLUMN
    user_id INTEGER REFERENCES users(id)
    ON DELETE SET NULL;