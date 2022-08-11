const { MessageEmbed } = require('discord.js');
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if(kanal) return;
    let data = await sunucuayar.findOne({guildID: message.guild.id})
       let members = message.guild.members.cache.filter(m => m.voice.channelID);
    let tag = data.TAG;
    let enAltYetkiliRolu = message.guild.roles.cache.get(data.EnAltYetkiliRol).position;
    let aktif3Kategori = message.guild.channels.cache.filter(c => c.type === "category").array().sort((a, b) => {
        let channels = message.guild.channels.cache.filter(c => c.type === "voice");
        let aChannel = channels.filter(x => x.parentID == a.id).map(c => c.members.size).reduce((q, w) => q + w, 0);
        let bChannel = channels.filter(x => x.parentID == b.id).map(c => c.members.size).reduce((q, w) => q + w, 0);
        return bChannel - aChannel;
    }).slice(0, 3);
    let desc = `Sesli kanallarda toplamda **${members.size}** üye bulunuyor!\nPublic ses kategorisinde toplamda **${members.filter(m => data.PUBCategory.includes(m.voice.channel.parentID)).size}** üye bulunuyor!\nSesli kanallarda **${members.filter(m => !m.user.username.includes(tag)).size}** normal üye bulunuyor!\nSesli kanallarda **${members.filter(m => m.user.username.includes(tag)).size}** taglı üye bulunuyor!\nSesli kanallarda **${members.filter(m => m.roles.highest.position >= enAltYetkiliRolu).size}** yetkili bulunuyor!\nSesli kanallarda **${members.filter(m => m.voice.streaming).size}** üye yayın yapıyor!\nMikrofonu kapalı üyeler: **${members.filter(m => m.voice.selfMute).size}**\nKulaklığı kapalı üyeler: **${members.filter(m => m.voice.selfDeaf).size}**\nBotlar: **${members.filter(m => m.user.bot).size}**\n\nTop **3** ses kategorisi:\n${aktif3Kategori.map((c, index) => `\`${index + 1}.\` ${c.toString()}: ${message.guild.channels.cache.filter(d => d.type === "voice" && d.parentID === c.id).map(d => d.members.size).reduce((q, w) => q + w, 0)}`).join("\n")}`;
    let embed = new MessageEmbed().setDescription(desc).setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setColor("BLACK").setTimestamp().setFooter(message.author.tag + " tarafından istendi!", message.author.avatarURL({ dynamic: true }));
    message.channel.send(embed).then(x => x.delete({ timeout: 50000 }));
};

exports.conf = {
    aliases: []
};
exports.help = {
    name: 'sesli'
};