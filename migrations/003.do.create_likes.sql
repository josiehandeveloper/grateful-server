CREATE TABLE likes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    count INTEGER NOT NULL default 1,
    post_id INTEGER
        REFERENCES posts(id) ON DELETE CASCADE NOT NULL, 
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL  
);

-- 1, 5, 25, date
-- 2, 5, 300, date
-- 2, 6, 25, date



-- SELECT count(id) FROM likes WHERE post_id=25; 300
-- SELECT count(id) FROM likes WHERE user=5; 15
-- SELECT post_id FROM likes WHERE user=5; [5,100,2000,2918177]
-- SELECT * FROM posts WHERE id IN [5,100,2000,2918177];
-- id, post_id, user_id, created