const LikesService = {
  getById(db, id) {
    return db
      .from("likes")
      .select(
        "like.id",
        "like.count",
        "like.date_created",
        "like.post_id",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.username,
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .leftJoin("users AS usr", "like.user_id", "usr.id")
      .where("like.id", id)
      .first();
  },

  insertLike(db, newLike) {
    return db
      .insert(newLike)
      .into("likes")
      .returning("*")
      .then(([like]) => like)
      .then((like) => LikesService.getById(db, like.id));
  },

  serializeLike(like) {
    return {
      id: like.id,
      post_id: like.post_id,
      date_created: like.date_created,
      user: like.user,
    };
  },
};

module.exports = LikesService;
