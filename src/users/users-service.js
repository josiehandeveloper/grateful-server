const knex = require("knex");
const xss = require("xss");
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
const bcrypt = require("bcryptjs");

const UserService = {
  getAllUsers(knex) {
    return knex.select("*").from("users");
  },
  hasUserWithEmail(knex, email) {
    return knex("users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  hasUserWithUsername(knex, username) {
    return knex("users")
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then((rows) => rows[0]);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number and special character";
    }
    return null;
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      email: xss(user.email),
      date_created: user.date_created,
    };
  },
};

module.exports = UserService;
