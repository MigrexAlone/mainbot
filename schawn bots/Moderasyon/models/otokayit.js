const mongoose = require("mongoose");
let otoKayitData = new mongoose.Schema({
    userID: { type: String, default: ""}, 
    roleID: {type: Array, default: []},
    name: {type: String, default: ""},
    age: {type: String, default: ""}
})
module.exports = mongoose.model("otokayit", otoKayitData);
