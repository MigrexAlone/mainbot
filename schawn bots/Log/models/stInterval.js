let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let muteInterval = Schema({

    userID: String,
    endDate: Number,
    sttype: Boolean

});

module.exports = mongoose.model("stInterval", muteInterval)