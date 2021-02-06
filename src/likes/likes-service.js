const LikesService = {
  getAllLikes(knex) {
    return knex.select("*").from("likes");
  },
  insertLike(knex, newLike) {
    return knex
      .insert(newLike)
      .into("likes")
      .returning("*")
      .then((row) => {
        return row[0];
      });
  },
  getById(knex, id) {
    return knex.from("likes").select("*").where("id", id).first();
  },
};

module.exports = LikesService;
