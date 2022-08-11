const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
  if (!message.guild) return;
    
    if (message.member.permissions.has(8) || durum) {
      let data = await sunucuayar.findOne({guildID: message.guild.id});
      let enAltYetkiliRol = data.EnAltYetkiliRol
      let role= message.guild.roles.cache.get(enAltYetkiliRol)
        if (!message.guild.roles.cache.some(c => c.name == "✔️ Katıldı")) {
          yoklama = await message.guild.roles.create({data: {name: "✔️ Katıldı",permissions: 0},reason: "FerhatAYDN - FerhatAYDN ♥"});
        } else
          yoklama = message.guild.roles.cache.find((role, key) => role.name == "✔️ Katıldı");
        if (!message.guild.roles.cache.some(c => c.name == "✔️ Katılmadı")) {
          katılmadı = await message.guild.roles.create({data: {name: "✔️ Katılmadı",permissions: 0},reason: "FerhatAYDN - FerhatAYDN ♥"});
       } else
          katılmadı = message.guild.roles.cache.find((role, key) => role.name == "✔️ Katılmadı");
       if (!message.guild.roles.cache.some(c => c.name == "✔️ Katılmadı 2")) {
          katılmadı2 = await message.guild.roles.create({data: {name: "✔️ Katılmadı 2",permissions: 0},reason: "FerhatAYDN - FerhatAYDN ♥"});
       } else
          katılmadı2 = message.guild.roles.cache.find((role, key) => role.name == "✔️ Katılmadı 2");

        const voiceChannel = message.member.voice.channel;
        if (voiceChannel.members.size < 1) return message.reply("Bu komut için ses kanalında en az 1 kişi olmalı.");
    //
        let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(client.ayarlar.footer).setColor("RANDOM").setTimestamp();
        let members = message.guild.members.cache.filter(member => !member.voice.channel && member.roles.cache.has(yoklama.id) && member.roles.cache.get(role.id));
        members.array().forEach((member, index) => {
          setTimeout(() => {
            if (member.roles.cache.get(katılmadı.id)) {
              member.roles.add(katılmadı2).catch();
            }
            member.roles.add(katılmadı).catch();
            member.roles.remove(yoklama).catch();
          }, index * 500)
        });
        let verildi = message.member.voice.channel.members.filter(member => member.roles.cache.has(yoklama.id) || !member.roles.cache.has(yoklama.id) && !member.user.bot && member.roles.cache.get(role.id))
        verildi.array().forEach((member, index) => {
          setTimeout(() => {
            if (member.roles.cache.get(katılmadı.id) || member.roles.cache.get(katılmadı2.id)) {
              member.roles.remove(katılmadı).catch();
              member.roles.remove(katılmadı2).catch();
            }
            member.roles.add(yoklama).catch();
          }, index * 500)
        });
        message.channel.send(embed.setDescription(`Başarılı bir şekilde \`${verildi.size} adet üyeye\` rol verildi!`)).catch();
    //
      } else {
        return message.reply("Bu komutu kullanabilmek için Yönetici olmalısın.")
      }
}
exports.conf = {aliases: ["toplantı"]};
exports.help = {name: 'yoklama'};
