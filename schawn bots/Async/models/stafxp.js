const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const voiceStatsSchema = Schema({
    "userID": String,
    "guildID": String,
    "currentXP": Number,
});

module.exports = mongoose.model("staffxp", voiceStatsSchema);