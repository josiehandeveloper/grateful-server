const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makePostsArray } = require("./posts.fixtures");

describe("Posts Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("posts").truncate());

  afterEach("cleanup", () => db("posts").truncate());

  describe(`GET /feed`, () => {
    context(`Given no posts`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/feed").expect(200, []);
      });
    });
    context("Given there are posts in the database", () => {
      const testPosts = makePostsArray();

      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPosts);
      });

      it(" it responds with 200 and all of the posts", () => {
        return supertest(app).get("/feed").expect(200, testPosts);
      });
    });
  });

  describe(`GET /feed/:post_id`, () => {
    context(`Given no posts`, () => {
      it(`responds with 404`, () => {
        const postId = 123456;
        return supertest(app)
          .get(`/feed/${postId}`)
          .expect(404, { error: { message: `Post doesn't exist` } });
      });
    });
    context("Given there are posts in the database", () => {
      const testPosts = makePostsArray();

      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPosts);
      });

      it("responds with 200 and the specified post", () => {
        const postId = 2;
        const expectedPost = testPosts[postId - 1];
        return supertest(app).get(`/feed/${postId}`).expect(200, expectedPost);
      });
    });
  });

  describe.only(`POST /feed`, () => {
    it(`creates a post, responding with 201 and the new post`, function () {
      const newPost = {
        content: "Test new post content",
      };
      return supertest(app)
        .post("./feed")
        .send(newPost)
        .expect(201)
        .expect((res) => {
          expect(res.body.content).to.eql(newPost.content);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/feed/${res.body.id}`);
          const expected = new Date().toLocaleString("en", { timeZone: "UTC" });
          const actual = new Date(res.body.date_created).toLocaleString;
          expect(actual).to.eql(expected);
        })
        .then((postRes) =>
          supertest(app).get(`/feed/${postRes.body.id}`).expect(postRes.body)
        );
    });

    const requiredFields = ["content"];

    requiredFields.forEach((field) => {
      const newPost = {
        content: "Test new post content...",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newPost[field];

        return supertest(app)
          .post("/feed")
          .send(newPost)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });

  describe.only(`DELETE /feed/:post_id`, () => {
    context(`Given no posts`, () => {
      it(`responds with 404`, () => {
        const postId = 123456;
        return supertest(app)
          .delete(`/feed/${postId}`)
          .expect(404, { error: { message: `Post doesn't exist` } });
      });
    });
    context("Given there are posts in the database", () => {
      const testPosts = makePostsArray();

      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPosts);
      });

      it("responds with 204 and removes the post", () => {
        const idToRemove = 2;
        const expectedPosts = testPosts.filter(
          (post) => post.id !== idToRemove
        );
        return supertest(app)
          .delete(`/feed/${idToRemove}`)
          .expect(204)
          .then((res) => supertest(app).get(`/feed`).expect(expectedPosts));
      });
    });
  });
});
