let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let dataOzelData = Schema({
        guildID: String,
        ekipRol: String,
})

module.exports = mongoose.model("ekip", dataOzelData);