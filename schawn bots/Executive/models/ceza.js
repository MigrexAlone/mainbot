let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cezaSchema = Schema({
    ID: {type: Number, default: 0},
    userID: {type: String, default: ""},
    Yetkili: {type: String, default: ""},
    Ceza: {type: String, default: ""},
    Sebep: {type: String, default: ""},
    Puan: {type: Number, default: 0},
    Atilma: {type: String, default: ""},
    Bitis: {type: String, default: ""},
})

module.exports = mongoose.model("penal", cezaSchema)