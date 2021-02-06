const express = require("express");
const knex = require("knex");
const xss = require("xss");
const { requireAuth } = require("../middleware/jwt-auth");
const ProfileService = require("./profile-service");
const path = require("path");

const profileRouter = express.Router();
const jsonParser = express.json();

profileRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    ProfileService.getAllPostsByUser(req.app.get("db"), req.user.id)
      .then((posts) => {
        if (!posts) {
          return res.status(404).json({
            error: { message: `No Posts` },
          });
        }
        res.json(posts);
      })
      .catch(next);
  })

  .delete(requireAuth, jsonParser, (req, res, next) => {
    const { post_id } = req.body;
    ProfileService.deletePost(req.app.get("db"), post_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = profileRouter;
