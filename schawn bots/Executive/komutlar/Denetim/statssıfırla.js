const {
    MessageEmbed
} = require("discord.js");
require("moment-timezone")
let Stat = require("../../models/stats");
let xpdata = require("../../models/stafxp");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sunucuData = await sunucuayar.findOne({
        guildID: message.guild.id
    });
    if (!sunucuData.GKV.includes(message.author.id) && !durum && !client.ayarlar.sahip.includes(message.author.id)) return;
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    rol.members.map(x => {
        Stat.updateOne({
            userID: x.id
        }, {
            $set: {
                yedi: {
                    Chat: {},
                    Voice: {},
                    TagMember: 0,
                    Invite: 0,
                    Man: 0,
                    Woman: 0
                }
            }
        }, {
            upsert: true
        }).exec();
        xpdata.updateOne({
            userID: x.id
        }, {
            $set: {
                currentXP: 0
            }
        }, {
            upsert: true
        }).exec();
    });
}
exports.conf = {
    aliases: ["stat-sıfırla"]
}
exports.help = {
    name: 'stats-sıfırla'
}