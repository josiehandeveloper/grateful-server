const path = require("path");
const express = require("express");
const PostsService = require("./posts-service");
const { requireAuth } = require("../middleware/jwt-auth");
const xss = require("xss");

const likesRouter = express.Router();
const jsonParser = express.json();

const serializeLike = (like) => ({
  id: like.id,
  likes: xss(like.likes),
});

likesRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    LikesService.getAllLikes(knexInstance)
      .then((posts) => {
        res.json(posts.map(serializeLike));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { likes, post_id, user_id } = req.body;
    const newLike = { likes, user_id: req.user.id, post_id };

    for (const [key, value] of Object.entries(newLike)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    if (req.body.id) {
      newLike.id = req.body.id;
    }
    LikesService.insertPost(req.app.get("db"), newLike)
      .then((post) => {
        res.status(201).location(`/feed/${post.id}`).json(serializePost(post));
      })
      .catch(next);
  });

postsRouter.route("/:post_id").all((req, res, next) => {
  PostsService.getById(req.app.get("db"), req.params.post_id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          error: { message: `Post doesn't exist` },
        });
      }
      res.post = post; // save the post for the next middleware
      next(); // don't forget to call next so the next middleware happens!
    })
    .catch(next);
});

module.exports = LikesRouter;
