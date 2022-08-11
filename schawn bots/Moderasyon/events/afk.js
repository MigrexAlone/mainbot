const { MessageEmbed, Discord } = require("discord.js");
let mongoose = require("mongoose");
let afk = require("../models/afk")
let moment = require("moment");
require("moment-duration-format");
moment.locale("tr")

module.exports = async message => {
    if(!message.guild) return;
    if (message.author.bot) return;

    let userData = await afk.findOne({userID: message.author.id, guildID: message.guild.id}) || {Reason: null, Time: null};

    let afkReason = userData.Reason;
    if (afkReason) {
      let ha = moment(userData.Time).fromNow()
      message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription("<@" + message.author.id + "> AFK modundan başarıyla çıkış yaptın, " + ha + " AFK olmuştun.")).then(msg => { msg.delete({ timeout: 7000 }) })
      let nicke = message.member.displayName.replace("[AFK]", "")
      await message.member.setNickname(nicke)
      afk.deleteOne({userID: message.author.id, guildID: message.guild.id}).exec();
    }
    message.mentions.members.forEach(async (u) => {
      let userData = await afk.findOne({userID: u.id, guildID: message.guild.id}) || {Reason: null, Time: null};
      let ha = moment(userData.Time).fromNow()
      if (userData.Reason) {
        message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription("<@" + userData.userID + "> " + ha + " AFK moduna geçti. Sebep: " + userData.Reason + " ")).then(msg => { msg.delete({ timeout: 7000 }) })
      }
    });
    
}
