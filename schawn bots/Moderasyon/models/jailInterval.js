let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let muteInterval = Schema({
    userID: {type: String, default: ""},
    endDate: {type: Number, default: null},
    jailed: {type: Boolean, default: false}
});

module.exports = mongoose.model("jailInterval", muteInterval)