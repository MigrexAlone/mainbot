const { MessageEmbed } = require("discord.js");
let mongoose = require("mongoose");

let slaveData = mongoose.Schema({

    userID: String,
    guildID: String,
    type: String

});
module.exports = mongoose.model("slaveData", slaveData);