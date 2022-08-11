const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');

exports.run = async (client, message, args, durum, kanal) => {
  if (!message.guild) return;
  let guild = message.guild;
  if (!client.ayarlar.sahip.some(x => x === message.author.id)) return
    if(args[0] === "kur" || args[0] === "setup" || args[0] === "kurulum") {
        guild.channels.create("schâwn log's", {type : "category"}).then(ct => {
        guild.channels.create("ses_log", {type : "text"}).then(x => { x.setParent(ct.id) } )
        guild.channels.create("ses_log_basit", {type : "text"}).then(x => { x.setParent(ct.id) } )
        guild.channels.create("ses_mic_log", {type : "text"}).then(x => { x.setParent(ct.id) } )
        guild.channels.create("rol_log", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("rol_log_basit", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("nickname_log", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("nickname_log_basit", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("join_leave_log", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("join_leave_log_basit", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("mesaj_silme_log", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("mesaj_edit_log", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("komut_log", {type : "text"}).then(x => { x.setParent(ct.id) })
        guild.channels.create("tag_log", {type : "text"}).then(x => { x.setParent(ct.id) })
          })
  };
  message.channel.send(new MessageEmbed().setColor("BLACK").setDescription(`• Log Kanalları Başarıyla Kuruldu`))
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['channels'],
    permLevel: 4
  };
  
  exports.help = {
    name: 'channel',
    description: "Sunucuda komut denemeye yarar",
    usage: 'eval <kod>',
    kategori: "Bot Yapımcısı"
  };
