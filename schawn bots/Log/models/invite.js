const mongoose = require('mongoose');

const inviterSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  userID: String,
  inviterID: String,
  regular: Number,
  bonus: Number,
  fake: Number
});

module.exports = mongoose.model("Invites", inviterSchema);