let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let data = Schema({
        guildID: String,
        komutAd: String,
        roller: Array,
        kisiler: Array,
})

module.exports = mongoose.model("specialPerms", data);