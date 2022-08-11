let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let client = global.client;
let vkLobi = Schema({
    ID: {type: Number, default: 1},
    Guild: {type: String, default: client.ayarlar.sunucuId},

    Lobby: {type: Array, default: [{
        ID: Number,
        Channel: String,
        Author: String,
        Date: Date.now(),
        Type: Boolean
    }]},

    Oyun: {type: Array, default: [{
        ID: Number,
        Zaman: String,
        Durum: Boolean,
        Liste: Object,
        Yasayanlar: Object,
        Oluler: Object
    }]}

})

module.exports = mongoose.model("vampirKoylu", vkLobi)