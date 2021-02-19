function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      email: "testuser1@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      user_name: "test-user-2",
      email: "testuser2@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      user_name: "test-user-3",
      email: "testuser3@test.com",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makePostsArray(users) {
  return [
    {
      id: 1,
      content: "First test post!",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      likes: 1,
      user_id: users[0].id,
    },
    {
      id: 2,
      content: "Second test post!",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      likes: 2,
      user_id: users[1].id,
    },
    {
      id: 2,
      content: "Third test post!",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      likes: 3,
      user_id: users[2].id,
    },
  ];
}

function makeExpectedPost(users, post) {
  const user = users.find((user) => user.id === post.user_id);

  return {
    id: post.id,
    content: post.content,
    date_created: post.date_created.toISOString(),
    number_of_comments,
    user: {
      id: user.id,
      user_name: author.user_name,
      date_created: author.date_created.toISOString(),
    },
  };
}

function makeMaliciousPost(user) {
  const maliciousPost = {
    id: 911,
    date_created: new Date(),
    user_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };
  const expectedPost = {
    ...makeExpectedPost([user], maliciousPost),
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousPost,
    expectedPost,
  };
}

function makePostsFixtures() {
  const testUsers = makeUsersArray();
  const testPosts = makePostsArray(testUsers);
  return { testUsers, testPosts };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        posts,
        users,
        likes
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE posts_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE likes_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('posts_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('likes_id_seq', 0)`),
        ])
      )
  );
}

function seedPostsTables(db, users, posts, comments = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await trx.into("users").insert(users);
    await trx.into("posts").insert(posts);
    // update the auto sequence to match the forced id values
    await Promise.all([
      trx.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id]),
      trx.raw(`SELECT setval('posts_id_seq', ?)`, [posts[posts.length - 1].id]),
    ]);
    // only insert likes if there are some, also update the sequence counter
    if (likes.length) {
      await trx.into("likes").insert(likes);
      await trx.raw(`SELECT setval('likes_id_seq', ?)`, [
        likes[likes.length - 1].id,
      ]);
    }
  });
}

function seedMaliciousPost(db, user, post) {
  return db
    .into("users")
    .insert([user])
    .then(() => db.into("posts").insert([post]));
}

module.exports = {
  makeUsersArray,
  makePostsArray,
  makeExpectedPost,
  makeMaliciousPost,

  makePostsFixtures,
  cleanTables,
  seedPostsTables,
  seedMaliciousPost,
};
