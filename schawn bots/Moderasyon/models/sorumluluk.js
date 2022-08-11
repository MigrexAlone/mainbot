const mongoose = require("mongoose");
let client = global.client;

let sorumlulukData = mongoose.Schema({
guildID: {type: String},
Ad: {type: String, default: ""},

Kişiler: Array,
});
module.exports = mongoose.model("sorumluluk", sorumlulukData);
