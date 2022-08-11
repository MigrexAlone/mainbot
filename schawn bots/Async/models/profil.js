let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let profilSchema = Schema({

    userID: {type: String, default: ""},
    guildID: {type: String, default: ""},

    BanAmount: {type: Number, default: 0},
    JailAmount: {type: Number, default: 0},
    WarnAmount: {type: Number, default: 0},
    ReklamAmount: {type: Number, default: 0},
    MuteAmount: {type: Number, default: 0},
    VoiceMuteAmount: {type: Number, default: 0},





});

module.exports = mongoose.model("profil", profilSchema);