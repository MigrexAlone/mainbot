const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const voiceStatsSchema = Schema({

    guildID: String,
    userID: String,
    
    yedi: {type: Object, default: {Id: "",Invite: 0, Chat: {},Voice: {},TagMember: 0, Man: 0, Woman: 0}},

    Man: {type: Number, default: 0},
    Woman: {type: Number, default: 0},
    
    voiceChannel: {type: Object, default: {}},
    messageChannel: {type: Object, default: {}},

    voiceCategory: {type: Object, default: {}},
    messageCategory: {type: Object, default: {}},

    totalVoice: {type: Number, default: 0},
    totalMessage: {type: Number, default: 0},

    voiceXP: {type: Number, default: 0},
    messageXP: {type: Number, default: 0},
    voiceLevel: {type: Number, default: 1},
    messageLevel: {type: Number, default: 1},
    coin: {type: Number, default: 0},
    autoRankup: {type: Array, default: []}

});

module.exports = mongoose.model("stats", voiceStatsSchema);