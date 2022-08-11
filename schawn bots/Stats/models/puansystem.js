const mongoose = require('mongoose');
let client = global.client;
let puansystem = mongoose.Schema({
    guildID: String,
    PublicKanallar: {type: Object, default: {"Id": [], "Puan": 15}},
    GameKanallar: {type: Object, default: {"Id": [], "Puan": 5}},
    KayitKanallar: {type: Object, default: {"Id": [], "Puan": 5}},
    StreamKanallar: {type: Object, default: {"Id": [], "Puan": 15}},
    SecretKanallar: {type: Object, default: {"Id": [], "Puan": 5}},
    SleepingKanal: {type: Object, default: {"Id": "", "Puan": 3.33}},
    AloneKanallar: {type: Object, default: {"Id": [], "Puan": 3.33}},
    TerapiKanallar: {type: Object, default: {"Id": [], "Puan": 15}},
    SorunCozmeKanallar: {type: Object, default: {"Id": [], "Puan": 15}},
    MesajKanallar: {type: Object, default: {"Id": [], "Puan": 0.08}},
    TagMember: {type: Number, default: 45},
    Invite: {type: Number, default: 2},
    Register: {type: Number, default: 3},
    DailyMission: {type: Object, default: {
        "logChannel": "",
        "category": [],
        "messageChannel": [],
        "unChannel": []
    }},
    AutoRankUP: {type: Object, default: {
        Type: true,
        LogChannel: ""
    }},
    LevelSystem: {type: Object, default: {
        Type: true,
        LogChannel: ""
    }},
    PuanRolSystem: {type: Array, default: []},
    AutoLogin: {type: Object, default: {Type: true}}
});
module.exports = mongoose.model("puansystem", puansystem)