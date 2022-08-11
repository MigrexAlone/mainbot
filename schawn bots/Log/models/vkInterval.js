let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let muteInterval = Schema({

    userID: String,
    endDate: Number,
    vktype: Boolean

});

module.exports = mongoose.model("vkInterval", muteInterval)