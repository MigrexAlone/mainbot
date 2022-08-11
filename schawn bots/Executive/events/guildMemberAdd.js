const {
  MessageEmbed
} = require("discord.js");
let moment = require("moment");
require('moment-duration-format');
require('moment-timezone');
moment.locale('tr');
let sunucuayar = require("../models/sunucuayar");
let jailInterval = require("../models/jailInterval");
let muteInterval = require("../models/muteInterval");
let vmuteInterval = require("../models/vmuteInterval");
let reklamInterval = require("../models/reklamInterval");
let dcInterval = require("../models/dcInterval");
let vkInterval = require("../models/vkInterval");
let stInterval = require("../models/stInterval");
let otokayit = require("../models/otokayit");
let puansystem = require("../models/puansystem");
const client = global.client;
let conf = client.ayarlar
module.exports = async member => {
  let data = await sunucuayar.findOne({});
  let kayitKanal = data.REGISTER;
  let rules = data.RULES;
  let kayitsizRol = "992847235131900014";
  let supheliRol = data.SUPHELI;
  let tag2 = data.TAG2;
  let tag = data.TAG;
  let kanalKontrol = client.channels.cache;
  let muteRol = data.MUTED;
  let vmuteRol = data.VMUTED;
  let jailRol = data.JAIL;
  let reklamRol = data.REKLAM;
  let DCCEZALI = data.DCCEZALI;
  let VKCEZALI = data.VKCEZALI;
  let STCEZALI = data.STCEZALI;
  let yasaklıTagRol = data.BANTAG
  let bantag = data.BAN_TAG;
  if (!kanalKontrol.get(kayitKanal)) return;


  let guvenilirlik = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;
  let jailKontrol = await jailInterval.findOne({
    userID: member.id
  }) || {
    jailed: false
  };
  let muteKontrol = await muteInterval.findOne({
    userID: member.id
  }) || {
    muted: false
  };
  let vmuteKontrol = await vmuteInterval.findOne({
    userID: member.id
  }) || {
    muted: false
  };
  let reklamKontrol = await reklamInterval.findOne({
    userID: member.id
  }) || {
    reklam: false
  };
  let dcKontrol = await dcInterval.findOne({
    userID: member.id
  }) || {
    dctype: false
  };
  let vkKontrol = await vkInterval.findOne({
    userID: member.id
  }) || {
    vktype: false
  };
  let stKontrol = await stInterval.findOne({
    userID: member.id
  }) || {
    sttype: false
  };
  let kayitsizRol2 = stKontrol.sttype == true ? kayitsizRol.push(STCEZALI) : vkKontrol.vktype == true ? kayitsizRol.push(VKCEZALI) : dcKontrol.dctype == true ? kayitsizRol.push(DCCEZALI) : reklamKontrol.reklam == true ? reklamRol :
    jailKontrol.jailed == true ? jailRol :
    muteKontrol.muted == true ? kayitsizRol.push(muteRol) :
    vmuteKontrol.muted == true ? kayitsizRol.push(vmuteRol) : bantag.some(tag => member.user.username.includes(tag)) ? yasaklıTagRol :
    kayitsizRol
  let autoLogin = await puansystem.findOne({
    guildID: member.guild.id
  })
  if (autoLogin.AutoLogin.Type == true) {
    let otoreg = await otokayit.findOne({
      userID: member.id
    });
    if (otoreg) {
      let otorolID = stKontrol.sttype == true ? otoreg.roleID.push(STCEZALI) : vkKontrol.vktype == true ? otoreg.roleID.push(VKCEZALI) : dcKontrol.dctype == true ? otoreg.roleID.push(DCCEZALI) : reklamKontrol.reklam == true ? reklamRol :
        jailKontrol.jailed == true ? jailRol : bantag.some(tag => member.user.username.includes(tag)) ? yasaklıTagRol :
        muteKontrol.muted == true ? otoreg.roleID.push(muteRol) :
        vmuteKontrol.muted == true ? otoreg.roleID.push(vmuteRol) :
        otoreg.roleID
      await member.roles.set(otorolID).then(x => {
        x.setNickname(`${member.user.username.includes(tag) ? tag : tag2} ${otoreg.name} | ${otoreg.age}`);
      })
      return kanalKontrol.get(kayitKanal).send(`${member} adlı kullanıcı daha önceden kayıt olduğu için sunucuya otomatik bir şekilde giriş yaptı.`);
    }
  }
  if (guvenilirlik) {
    await member.roles.set([supheliRol]).catch(() => {})
    return kanalKontrol.get(kayitKanal).send(`\`${member.user.username}\` adlı kullanıcının hesabı 7 Gün'den önce açıldığı için karantinaya gönderildi`);
  } else {
    await member.roles.add(kayitsizRol).then(async () => {
      await member.setNickname(`${member.displayName}`)
      kanalKontrol.get(kayitKanal).send(`
${client.emojis.cache.find(x => x.name === "yildiz")} **${member} Aramıza hoş geldin, bizde seni bekliyorduk ${client.emojis.cache.find(x => x.name === "yildiz")}**

  ${client.emojis.cache.find(x => x.name === "yildiz")} Seninle beraber sunucumuz ${member.guild.memberCount} üye sayısına ulaştı.

    ${client.emojis.cache.find(x => x.name === "yildiz")} Hesabın **${member.user.createdAt.toTurkishFormatDate()}** tarihinde __**(${client.tarihHesapla(member.user.createdAt)})**__ oluşturulmuş. ${client.emojis.cache.find(x => x.name === "schawn_tik")}

    ${client.emojis.cache.find(x => x.name === "yildiz")} ${client.channels.cache.find(x => x.name === "rules")} kanalına göz atmayı unutmayınız. <@&959806314098352220> Rolündeki arkadaşlar sizinle ilgilenecektir.

  ${client.emojis.cache.find(x => x.name === "yildiz")} Kayıt olduktan sonra kuralları okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünede bulundurarak yapacağız.`).catch(console.error);

    })
  }
};
client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

Array.prototype.chunk = function (chunk_size) {
  let myArray = Array.from(this);
  let tempArray = [];
  for (let index = 0; index < myArray.length; index += chunk_size) {
    let chunk = myArray.slice(index, index + chunk_size);
    tempArray.push(chunk);
  }
  return tempArray;
};
Date.prototype.toTurkishFormatDate = function () {
  return moment.tz(this, "Europe/Istanbul").locale("tr").format('LLL');
};

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dakika]');
};
