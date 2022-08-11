let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let roleLog = Schema({
    userID: {type: String, default: ""},
    Member: {type: String, default: ""},
    Zaman: {type: Number, default: 0},
    Type: {type: String, default: ""},
    Role: {type: String, default: ""}
});

module.exports = mongoose.model("rol-log", roleLog);