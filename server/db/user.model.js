const mongoose = require("mongoose");
const UserSchema = require("./user.schema").UserSchema;
const UserModel = mongoose.model("UserSchema", UserSchema);

function insertUser(user) {
  return UserModel.create(user);
}

function getUserByUsername(username) {
  return UserModel.findOne({ username: username }).exec();
}

async function updateUserDescription(username, newDescription) {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { username: username },
      { $set: { description: newDescription } },
      { new: true },
    ).exec();
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  insertUser,
  getUserByUsername,
  updateUserDescription,
};
