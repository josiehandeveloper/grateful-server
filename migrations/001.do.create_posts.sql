CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL, 
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    likes INTEGER NOT NULL default 1
);
