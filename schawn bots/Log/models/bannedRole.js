let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let banRole = Schema({
    BanRole: {type: Array, default: []}
});

module.exports = mongoose.model("banrol", banRole);