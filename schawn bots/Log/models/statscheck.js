let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let client = global.client;
let statsCheck = Schema({
    userID: {type: String, default: ""},
    guildID: {type: String, default: ""},
    start: {type: Number, default: Date.now()},
    auditstart: {type: Number, default: Date.now()},
    parent: {type: String, default: ""},
    channel: {type: String, default: ""}
});

module.exports = mongoose.model("statsCheck", statsCheck);