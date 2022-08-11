const mongoose = require('mongoose');
let soruncozme = mongoose.Schema({
    guildID: String,
    Type: Boolean,
    userID: String,
    Time: Number,
    EndTime: Number,
    Kisi: Array,
    Katılanlar: Array
});
module.exports = mongoose.model("soruncozme", soruncozme);


