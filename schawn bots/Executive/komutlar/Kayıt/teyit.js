const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let teyit = require("../../models/stats");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let data = await sunucuayar.findOne({});
    let kayitSorumlusu = data.REGISTERAuthorized;
    let jailSorumluRol = data.JAILAuthorized;
    if (message.member.permissions.has(8) || message.guild.roles.cache.some(rol => kayitSorumlusu.some(rol2 => rol === rol2)) || message.guild.roles.cache.some(rol => jailSorumluRol.some(rol2 => rol === rol2)) || durum) {
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
        let data = await teyit.findOne({userID: target.id, guildID: message.guild.id});
        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(conf.footer)
            .setAuthor(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setDescription(`**Toplam Bilgiler**
\`Erkek: ${data.yedi.Man} Kadın: ${data.yedi.Woman} (${data.yedi.Man + data.yedi.Woman})\``)
        message.channel.send(embed)



    } else return;
}
exports.conf = {
    aliases: ["teyitbilgi"]
}
exports.help = {
    name: 'Teyitbilgi'
}

