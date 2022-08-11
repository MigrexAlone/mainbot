let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let kontrol = Schema({
    guildID: String,
    haftalik: Number,
});

module.exports = mongoose.model("kontrol", kontrol);