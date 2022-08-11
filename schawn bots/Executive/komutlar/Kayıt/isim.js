const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let teyit = require("../../models/teyit");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let data = await sunucuayar.findOne({guildID: message.guild.id});
    if(message.member.roles.cache.some(rol => data.REGISTERAuthorized.some(rol2 => rol.id == rol2)) || message.member.permissions.has(8) || durum) {
        let tag = data.TAG
        let tag2 = data.TAG2;
    
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply("Lütfen bir kullanıcı etiketleyiniz veya ID belirtiniz");
    
        let isim = args[1][0].toUpperCase() + args[1].substring(1);
        let yaş = Number(args[2]);
    
        if (!isim) return message.reply("Lütfen bir isim belirtiniz");
        if (!yaş) return message.reply("Lütfen bir yaş belirtiniz");
    
        await message.guild.member(target.id).setNickname(`${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} ${isim} | ${yaş}`).then(x => message.react(client.emojis.cache.find(x => x.name === "schawn_tik")))
        teyit.updateOne({userID: target.id, guildID: message.guild.id}, {$push: {userName: `\`${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} ${isim} | ${yaş}\` (İsim Güncellendi)`}}).exec()
    } else return;
};

exports.conf = {
    aliases: ["isim", "İsim", "İSİM", "ISIM"]
};
exports.help = {
    name: 'name'
};