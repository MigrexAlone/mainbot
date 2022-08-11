const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let Database = require("../../models/invite");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    if (message.member.permissions.has(8) || conf.sahip.some(user => message.author.id === user) || durum) {
        if (args[0] === "kanal") {
            let kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (!kanal) return
            let inviteKanal = await sunucuayar.findOne({})

            return inviteKanal.INVITEChannel = kanal.id, inviteKanal.save().then(async (data) => message.channel.send(`Başarılı bir şekilde davet kanalını ${kanal} olarak tanımladınız!`))

        }
    }

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setAuthor(uye.displayName, uye.user.displayAvatarURL({
        dynamic: true
    })).setColor(uye.displayHexColor).setFooter(conf.footer).setTimestamp();
    Database.findOne({
        guildID: message.guild.id,
        userID: uye.id
    }, (err, inviterData) => {
        if (!inviterData) {
            embed.setDescription(`Toplam **0** davete sahip! (**0** gerçek, **0** bonus, **0** fake, **0** haftalık)`);
            message.channel.send(embed);
        } else {
            Database.find({
                guildID: message.guild.id,
                inviterID: uye.id
            }).sort().exec((err, inviterMembers) => {
                let dailyInvites = 0;
                if (inviterMembers.length) {
                    dailyInvites = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000 * 60 * 60 * 24 * 7).length;
                };
                embed.setDescription(`Toplam **${inviterData.regular+inviterData.bonus}** davete sahip! (**${inviterData.regular}** gerçek, **${inviterData.bonus}** bonus, **${inviterData.fake}** fake, **${dailyInvites}** haftalık)`);
                message.channel.send(embed);
            });
        };
    });
}
exports.conf = {aliases: ["davet", "rank"]}
exports.help = {name: 'invite'}