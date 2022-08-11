const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let Database = require("../../models/invite");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    if (!client.ayarlar.sahip.includes(message.author.id)) return;
    message.guild.fetchInvites().then(async invites => {
        invites.forEach(async invite => {
          let author = invite.inviter;
          let uses = invite.uses;
          if(!author) return;
          //await Database.updateMany({userID: author.id}, {$set: {bonus: 0}}).exec()
          await Database.updateOne({userID: author.id}, {$inc: {bonus: uses}}).exec()
        });
      })
}
exports.conf = {aliases: ["davetleriekle"]};
exports.help = {name: 'alladdinvite'};