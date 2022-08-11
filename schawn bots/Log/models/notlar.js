const mongoose = require("mongoose");

const Note = mongoose.Schema({
  guildID: String,
  userID: String,
  updateAt: Number,
  title: String,
  content: String,
  link: String
});

module.exports = mongoose.model("Notes", Note);