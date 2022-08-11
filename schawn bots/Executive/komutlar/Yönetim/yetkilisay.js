const {
  MessageEmbed,
  Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let yetkilisay = require("../../models/yetkilisay");
let table = require("string-table");
module.exports.run = async (client, message, args, durum, kanal) => {
  
  if (!message.guild) return;
    
  let data = await sunucuayar.find({})
  if (message.member.hasPermission('MANAGE_CHANNELS') || durum) {
    let enAltYetkiliRol = data[0].EnAltYetkiliRol
    const sec = args[0]
    if (!sec) {
      let Kisukea = message.guild.members.cache.filter(member => {
        return member.roles.cache.has(enAltYetkiliRol) && !member.voice.channel && member.presence.status !== "offline" && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id)
      }).map(member => ("<@" + member.user.id + ">"));

      let Kisuke = message.guild.members.cache
        .filter(member => {
          return member.roles.cache.has(enAltYetkiliRol) && !member.voice.channel && member.presence.status !== "offline" && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id)
        }).size;
      let toplamyetkili = message.guild.roles.cache.get(enAltYetkiliRol).members.size
      let sesteOlanYetkili = message.guild.members.cache.filter(member => member.roles.cache.has(enAltYetkiliRol) && member.voice.channel && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id)).size;
      let aktifYetkili = message.guild.members.cache.filter(member => member.roles.cache.has(enAltYetkiliRol) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && (member.presence.status !== "offline")).size;
      let offlineYetkili = message.guild.members.cache.filter(member => member.roles.cache.has(enAltYetkiliRol) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && member.presence.status == "offline").size;

      let tablo = [{
        "TOPLAM": toplamyetkili + " kişi",
        "AKTİF": aktifYetkili + " kişi",
        "KAPALI": offlineYetkili + " kişi",
        "SESTE": sesteOlanYetkili + " kişi",
        "SESTE OLMAYAN": Kisuke + " kişi"
      }]

      message.channel.send(table.create(tablo), {
        code: "md",
        split: true
      })
      message.channel.send(`${Kisukea || "Herkes aktif görünüyor"}`, {
        code: "md",
        split: true
      })
    }

  } else return;
}
exports.conf = {
  aliases: ["ysay", "seslikontrol", "Yetkilisay", "yetkili-say"]
}
exports.help = {
  name: 'yetkilisay'
}