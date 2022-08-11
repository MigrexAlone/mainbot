let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let muteInterval = Schema({

    userID: String,
    endDate: Number,
    dctype: Boolean

});

module.exports = mongoose.model("dcInterval", muteInterval)