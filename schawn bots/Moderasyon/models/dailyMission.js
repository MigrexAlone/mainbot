let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let day = new Schema({
    guildID: String,
    Date: Number
});

module.exports = mongoose.model("day", day)