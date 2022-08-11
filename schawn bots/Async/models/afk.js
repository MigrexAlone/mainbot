let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let afkSchema = Schema({
    userID: {type: String, default: ""},
    guildID: {type: String, default: ""},

    Type: {type: Boolean, default: false},
    Reason: {type: String, default: ""},
    Time: {type: Number, default: Date.now()},
})

module.exports = mongoose.model("afk", afkSchema)