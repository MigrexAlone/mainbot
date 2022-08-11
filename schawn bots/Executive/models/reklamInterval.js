let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let reklamInterval = Schema({

    userID: String,
    endDate: Number,
    reklam: Boolean

});

module.exports = mongoose.model("reklamInterval", reklamInterval)