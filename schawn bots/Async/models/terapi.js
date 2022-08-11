const mongoose = require('mongoose');
let terapi = mongoose.Schema({
    guildID: String,
    Type: Boolean,
    userID: String,
    Time: Number,
    EndTime: Number,
    Kisi: String,
    Katılanlar: Array
});
module.exports = mongoose.model("terapi", terapi);


