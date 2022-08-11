const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let teyit = require("../../models/teyit");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    let data = await sunucuayar.findOne({});
    let kayitSorumlusu = data.REGISTERAuthorized;
    let jailSorumluRol = data.JAILAuthorized;
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    let teyitData = await teyit.findOne({
        userID: target.id,
        guildID: message.guild.id
    }) || {userName: []};


    if (message.member.permissions.has(8) || message.guild.roles.cache.some(rol => kayitSorumlusu.some(rol2 => rol === rol2)) || message.guild.roles.cache.some(rol => jailSorumluRol.some(rol2 => rol === rol2)) || durum) {
        let embed = new MessageEmbed()
            .setAuthor(target.displayName, target.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor("RANDOM")
            .setDescription(`
${teyitData.userName.length <=0 ? `İsim Geçmişi Bulunamadı.` : `${target} kişisinin toplamda ${teyitData.userName.length} isim kayıtı bulundu.`} 

${teyitData.userName.reverse().join("\n")}`)
        message.channel.send(embed)
    } else return;
}
exports.conf = {
    aliases: ["İsimler", "names"]
}
exports.help = {
    name: 'isimler'
}