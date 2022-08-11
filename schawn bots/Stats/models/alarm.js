const mongoose = require("mongoose");

const alarm = mongoose.Schema({
    uye: String,
    kanal: String,
    baslangic: Number,
    bitis: Number,
    aciklama: String
});

module.exports = mongoose.model("alarmlar", alarm);