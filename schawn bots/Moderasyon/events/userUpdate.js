const {
  MessageEmbed
} = require("discord.js");
let moment = require("moment");
let sunucuayar = require("../models/sunucuayar");
let tagData = require("../models/taglıUye");
let statData = require("../models/stats");
let otokayit = require("../models/otokayit");
let client = global.client;
module.exports = async (oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    let ayarlar = await sunucuayar.findOne({})
    let yasaklıtag = ayarlar.BAN_TAG;
    let yasaklıtagRol = ayarlar.BANTAG;
    let boostRol = ayarlar.BOOST;
    let guild = client.guilds.cache.get(ayarlar.guildID);
    let user = guild.members.cache.get(oldUser.id);
    
    const embed = new MessageEmbed().setAuthor(user.displayName, user.user.avatarURL({
      dynamic: true
    })).setFooter(client.ayarlar.footer).setColor("RANDOM").setTimestamp();
    let log = client.channels.cache.get(ayarlar.TAGLOG);
    if (!log) return;
    if (newUser.username.includes(ayarlar.TAG) && !user.roles.cache.has(ayarlar.TEAM)) {
      await user.setNickname(user.displayName.replace(ayarlar.TAG2, ayarlar.TAG))
      if (ayarlar.TEAM) await user.roles.add(ayarlar.TEAM).catch();
      if (ayarlar.TAGLOG && log) log.send(embed.setDescription(`${user} kişisi ismine \`${ayarlar.TAG}\` sembolünü alarak <@&${ayarlar.TEAM}> ekibimize katıldı!`).setColor("#32FF00")).catch();
      await tagData.findOne({userID: user.id, Durum: "stat"}, async (err, res) => {
        if (!res) {
          let newData = new tagData({userID: user.id,authorID: "x",Tarih: Date.now(),Durum: "stat"});
          newData.save();
        }
      })
      await tagData.findOne({userID: user.id, Durum: "puan"}, async (err, res) => {
        if (!res) {
          let newData = new tagData({userID: user.id,authorID: "x",Tarih: Date.now(),Durum: "puan"});
          newData.save();
        }
      })
    } else if (!newUser.username.includes(ayarlar.TAG) && user.roles.cache.has(ayarlar.TEAM)) {
      await user.setNickname(user.displayName.replace(ayarlar.TAG, ayarlar.TAG2))
      if (ayarlar.TEAM) {
        let ekipRol = guild.roles.cache.get(ayarlar.TEAM);
        if (client.ayarlar.taglıAlım == true) {
          await tagSaldi(user.id)
          return await user.roles.set(user.roles.cache.get(ayarlar.BOOST) ? ayarlar.UNREGISTER.push(ayarlar.BOOST) : ayarlar.UNREGISTER)
        }
        await user.roles.remove(user.roles.cache.filter(rol => ekipRol.position <= rol.position && !rol.managed)).catch();
        await tagSaldi(user.id)
      }
      if (ayarlar.TAGLOG && log) log.send(embed.setDescription(`${user} kişisi isminden \`${ayarlar.TAG}\` sembolünü çıkararak <@&${ayarlar.TEAM}> ekibimizden ayrıldı!`).setColor("#B20000")).catch();
    } else if (yasaklıtag.some(tag => newUser.username.includes(tag)) && !user.roles.cache.has(yasaklıtagRol)) {
      user.user.send(`İsmine yasaklı tag aldığın için sunucumuzda kısıtlandırıldın.`)
      await user.roles.set(user.roles.cache.get(boostRol) ? [boostRol, yasaklıtagRol] : [yasaklıtagRol]).catch(() => {
        console.log("Yasaklı tag güncelleme kodunda rol verilirken bir hata meydana geldi")
      });
    } else if (!yasaklıtag.some(tag => newUser.username.includes(tag)) && user.roles.cache.has(yasaklıtagRol)) {

user.user.send(`**Ne güzel ne güzel :)**
Yasaklı Tag'ı kaldırmışsın tekrardan **Hoşgeldin!**`)
        await user.roles.set(user.roles.cache.get(boostRol) ? ayarlar.UNREGISTER.push(boostRol) : ayarlar.UNREGISTER);
        await user.setNickname(`${user.username.includes(ayarlar.TAG) ? ayarlar.TAG : ayarlar.TAG2} İsim | Yaş`).catch();
      
    };
  };
};
async function tagSaldi(memberID) {
  await tagData.deleteMany({
    userID: memberID
  });
};
