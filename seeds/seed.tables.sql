BEGIN;

TRUNCATE 
  likes.
  posts,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, email, password)
VALUES
  ('dunder', 'dunder@yahoo.com', 'password1!'),
  ('b.deboop', 'b.deboop@yahoo.com', 'bo-password2!'),
  ('c.bloggs', 'c.bloggs@yahoo.com', 'charlie-password3!');

INSERT INTO posts (user_id, content)
VALUES
  (1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi1'),
  (2, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi2' ),
  (3, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi3' );

INSERT INTO likes (
  
)