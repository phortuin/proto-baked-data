DROP TABLE IF EXISTS blogs;

CREATE TABLE blogs (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    body TEXT
);
