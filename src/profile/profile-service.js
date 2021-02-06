const ProfileService = {
  getAllPostsByUser(knex, user_id) {
    return knex.select("*").from("posts").where({ user_id });
  },
  insertPost(knex, newPost) {
    return knex
      .insert(newPost)
      .into("posts")
      .returning("*")
      .then((row) => {
        return row[0];
      });
  },
  getById(knex, id) {
    return knex.from("posts").select("*").where("id", id).first();
  },
  deletePost(knex, id) {
    return knex("posts").where({ id }).delete();
  },
};

module.exports = ProfileService;
