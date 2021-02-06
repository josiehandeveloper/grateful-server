const path = require("path");
const express = require("express");
const PostsService = require("./posts-service");
const { requireAuth } = require("../middleware/jwt-auth");
const xss = require("xss");

const postsRouter = express.Router();
const jsonParser = express.json();

postsRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    PostsService.getAllPosts(req.app.get("db"))
      .then((posts) => {
        res.json(posts);
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { content } = req.body;
    const newPost = { content, user_id: req.user.id };

    for (const [key, value] of Object.entries(newPost)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    PostsService.insertPost(req.app.get("db"), newPost)
      .then((post) => {
        res.status(201).location(`/feed`).json(post);
      })
      .catch(next);
  });

module.exports = postsRouter;
