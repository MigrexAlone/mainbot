let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let muteInterval = Schema({

    userID: String,
    endDate: Number,
    muted: Boolean

});

module.exports = mongoose.model("muteInterval", muteInterval)