const Schema = require("mongoose").Schema;

exports.UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    createdTime: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "userTable" },
);
