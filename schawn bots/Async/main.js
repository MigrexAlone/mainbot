const {MessageEmbed} = require("discord.js");
const Discord = require('discord.js');
const client = global.client = new Discord.Client({fetchAllMembers: true});
const logs = require('discord-logs');
logs(client);
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
let mainSettings = require(__dirname + "/../settings.js");
let mongoose = require("mongoose");
let sunucuayar = require("./models/sunucuayar");
let muteInterval = require("./models/muteInterval");
let vmuteInterval = require("./models/vmuteInterval");
let jailInterval = require("./models/jailInterval");
let dcInterval = require("./models/dcInterval");
let vkInterval = require("./models/vkInterval");
let stInterval = require("./models/stInterval");
let tagInterval = require("./models/taglıUye");
let authorityInterval = require("./models/authority_user");

let randMiss = require("./models/randomMission");
let dayMiss = require("./models/dailyMission");
let xpData = require("./models/stafxp");
let puansystem = require("./models/puansystem");

mongoose.connect(mainSettings.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

Array.prototype.shuffle = function () {
    let i = this.length;
    while (i) {
      let j = Math.floor(Math.random() * i);
      let t = this[--i];
      this[i] = this[j];
      this[j] = t;
    }
    return this;
  };

client.on("ready", async () => {
    client.user.setPresence({ activity: { name: mainSettings.footer }, status: "invisible" });
    let sunucuData = await sunucuayar.findOne({guildID: mainSettings.sunucuId})
    let muteRol = sunucuData.MUTED;
    let vmuteRol = sunucuData.VMUTED;
    let VKCEZALI = sunucuData.VKCEZALI;
    let DCCEZALI = sunucuData.DCCEZALI;
    let STCEZALI = sunucuData.STCEZALI;

    console.log("Başarılı bir şekilde giriş yaptı")
      let dailyData = await puansystem.findOne({guildID: mainSettings.sunucuId}) || {DailyMission: {Type: false}};

        setInterval(async () => {
          let kontrol = await randMiss.find({});
          kontrol.forEach(async memberData => {
            let mission = memberData.Mission;
            if (memberData.Check >= mission.AMOUNT) {
              randMiss.deleteOne({
                userID: memberData.userID
              }).exec();
              if (mission.MISSION == "ses") {
                xpData.updateOne({userID: memberData.userID}, {$inc: {currentXP: mission.AMOUNT/(1000 * 60 * 60) * 60}}, {upsert: true}).exec()
                client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${memberData.userID}> adlı üye **ses** adlı görevini tamamladı! (\`${(mission.AMOUNT/(1000 * 60 * 60) * 15).toFixed(0)} Puan\`)`)
              }
              if (mission.MISSION == "mesaj") {
                xpData.updateOne({userID: memberData.userID}, {$inc: {currentXP: mission.AMOUNT*0.3}}, {upsert: true}).exec()
                client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${memberData.userID}> adlı üye **mesaj** adlı görevini tamamladı! (\`${(mission.AMOUNT*0.08).toFixed(0)} Puan\`)`)
              }
              if (mission.MISSION == "davet") {
                xpData.updateOne({userID: memberData.userID}, {$inc: {currentXP: mission.AMOUNT*14}}, {upsert: true}).exec()
                client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${memberData.userID}> adlı üye **davet** adlı görevini tamamladı! (\`${(mission.AMOUNT*2).toFixed(0)} Puan\`)`)
              }
              if (mission.MISSION == "taglı") {
                xpData.updateOne({userID: memberData.userID}, {$inc: {currentXP: mission.AMOUNT*60}}, {upsert: true}).exec()
                client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${memberData.userID}> adlı üye **taglı** adlı görevini tamamladı! (\`${(mission.AMOUNT*45).toFixed(0)} Puan\`)`)
              }
              if (mission.MISSION == "teyit") {
                xpData.updateOne({userID: memberData.userID}, {$inc: {currentXP: mission.AMOUNT*6}}, {upsert: true}).exec()
                client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${memberData.userID}> adlı üye **teyit** adlı görevini tamamladı! (\`${(mission.AMOUNT*3).toFixed(0)} Puan\`)`)
              }
            }
          })
        }, 30000);
        setInterval(async () => {
          let arr = ["davet", "mesaj", "ses", "taglı", "teyit"];
          let dagit = []
          dayMiss.findOne({
            guildID: mainSettings.sunucuId
          }, async (err, res) => {
            if (!res) {
              let newData = new dayMiss({
                guildID: mainSettings.sunucuId,
                Date: Date.now()
              })
              newData.save()
            } else {
              if (Date.now() - res.Date >= 1000 * 60 * 60 * 24 * 1) {
                  let enAltYetkiliRol = await sunucuayar.findOne({}).then(x => x.EnAltYetkiliRol);
                  client.guilds.cache.get(mainSettings.sunucuId).roles.cache.get(enAltYetkiliRol).members.array().shuffle().forEach((x, index) => {
                    arr.shuffle()
                    let random = arr[Math.floor(Math.random() * arr.length)]
                    dagit.push({
                      user: x.id,
                      gorev: random
                    })
                  });
                  let veri = dagit;
                  let kategoriler = dailyData.DailyMission.category;
                  let messageKategori = dailyData.DailyMission.messageChannel;
                  let yasaklıkanal = dailyData.DailyMission.unChannel;
    
                  let VoiceChannel = client.guilds.cache.get(mainSettings.sunucuId).channels.cache.filter(chan => chan.type == "voice" && kategoriler.includes(chan.parentID) && !yasaklıkanal.includes(chan.id)).map(channel => channel.id)
                  let MessageChannel = client.guilds.cache.get(mainSettings.sunucuId).channels.cache.filter(chan => chan.type == "text" && messageKategori.includes(chan.id)).map(channel => channel.id)
                  client.channels.cache.get(dailyData.DailyMission.logChannel).send(`\`\`\`${client.guilds.cache.get(mainSettings.sunucuId).name} ${moment(Date.now()).locale("tr").format("LLL")} tarihinde dağıtılan günlük görevler;\`\`\``);
                  veri.forEach((user, index) => {
                    setTimeout(async () => {
                      if (index >= veri.length) return client.channels.cache.get(`${message.channel.id}`).send(`Başarılı bir şekilde tüm görevler dağıtıldı.`);
                      let mesajRandom = getRandomInt(300, 400)
                      let davetRandom = getRandomInt(5, 10)
                      let sesRandom = getRandomInt(60, 300)
                      let taglıRandom = getRandomInt(1, 3)
                      let teyitRandom = getRandomInt(5, 20)
                      let miktarlar = user.gorev == "mesaj" ? mesajRandom:user.gorev == "davet" ? davetRandom:user.gorev == "ses" ? sesRandom:user.gorev == "taglı" ? taglıRandom:user.gorev == "teyit" ? teyitRandom: 0
                      if (user.gorev == "ses") {
                        client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${user.user}> Bugün **Public Odalarda** \`${miktarlar}\` dakika ses aktifliği yapman gerekiyor.`);
                        randMiss.updateOne({userID: user.user}, {$set: {userID: user.user, Check: 0, Mission: {ID: user.user, MISSION: user.gorev, AMOUNT: 1000*60*sesRandom, CHANNEL: VoiceChannel}}}, {upsert: true}).exec()
                        }
                        if (user.gorev == "mesaj") {
                        let MessageRandom = MessageChannel[Math.floor(Math.random() * MessageChannel.length)];
                        client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${user.user}> Bugün <#${MessageRandom}> kanalında \`${miktarlar}\` adet mesaj yazman gerekiyor.`);
                        randMiss.updateOne({userID: user.user}, {$set: {userID: user.user, Check: 0, Mission: {ID: user.user, MISSION: user.gorev, AMOUNT: mesajRandom, CHANNEL: MessageRandom}}}, {upsert: true}).exec()
                        }
                        if (user.gorev == "taglı") {
                        client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${user.user}> Bugün \`${miktarlar}\` adet taglı üye çekmen gerekiyor.`);
                        randMiss.updateOne({userID: user.user}, {$set: {userID: user.user, Check: 0, Mission: {ID: user.user, MISSION: user.gorev, AMOUNT: taglıRandom}}}, {upsert: true}).exec()
                        }
                        if (user.gorev == "teyit") {
                        client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${user.user}> Bugün \`${miktarlar}\` adet teyit yapman gerekiyor.`);
                        randMiss.updateOne({userID: user.user}, {$set: {userID: user.user, Check: 0, Mission: {ID: user.user, MISSION: user.gorev, AMOUNT: teyitRandom}}}, {upsert: true}).exec()
                        }
                        if (user.gorev == "davet") {
                        client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${user.user}> Bugün \`${miktarlar}\` adet davet yapman gerekiyor.`);
                        randMiss.updateOne({userID: user.user}, {$set: {userID: user.user, Check: 0, Mission: {ID: user.user, MISSION: user.gorev, AMOUNT: davetRandom}}}, {upsert: true}).exec()
                        }
                    }, index*2000)
                  })
                  randMiss.updateMany({},{$set: {Check: 0}}, {multi: true}).exec()
                  res.Date = Date.now(), res.save();
              }
            }
          })
        }, 30000)

    let sunucu = client.guilds.cache.get(mainSettings.sunucuId);
    setInterval(async () => {
        let veri = await authorityInterval.find({});
        veri.forEach(async memberData => {
            if (!sunucu) return;
            if (!sunucu.members.cache.has(memberData.VerilenUye)) {
                authorityInterval.deleteOne({VerilenUye: memberData.VerilenUye}).exec();
            } else {
                let member = sunucu.members.cache.get(memberData.VerilenUye);
                if (!member) return;
                if (!member.user.username.includes(sunucuData.TAG)) {
                    member.roles.remove(memberData.VerilenRoller)
                    authorityInterval.deleteOne({VerilenUye: memberData.VerilenUye}).exec();
                };
            };
        });
    }, 1000 * 60 * 3);
    setInterval(async () => {

        let muted = await muteInterval.find({
            "muted": true,
            "endDate": {
                $lte: Date.now()
            }
        });
        muted.forEach(async memberdata => {
            if (!sunucu) return;
            if (!sunucu.members.cache.has(memberdata.userID)) {
                muteInterval.deleteOne({userID: memberdata.userID}).exec()
            } else {
                let member = sunucu.members.cache.get(memberdata.userID)
                if (!member) return;
                await member.roles.remove(muteRol)
                await muteInterval.deleteOne({userID: memberdata.userID}).exec()
            }
        });

        let jail = await jailInterval.find({
            "jailed": true,
            "endDate": {
                $lte: Date.now()
            }
        });

        jail.forEach(async memberdata => {

            if (!sunucu) return;
            if (!sunucu.members.cache.has(memberdata.userID)) {
                jailInterval.deleteOne({userID: memberdata.userID}).exec();
            } else {
                let member = sunucu.members.cache.get(memberdata.userID)
                if (!member) return;
                let unregister = sunucuData.UNREGISTER;
                let booster = sunucuData.BOOST;
                member.roles.cache.has(sunucuData.BOOST) ? unregister.push(booster) : unregister;
                await member.roles.set(unregister)
                jailInterval.deleteOne({userID: member.id}).exec();
            }
        });

        let vmuted = await vmuteInterval.find({
            "muted": true,
            "endDate": {
                $lte: Date.now()
            }
        })
        vmuted.forEach(async memberdata => {
            if (!sunucu) return;
            if (!sunucu.members.cache.has(memberdata.userID)) {
                vmuteInterval.deleteOne({userID: memberdata.userID}).exec();
            } else {
                let member = sunucu.members.cache.get(memberdata.userID)
                if (!member) return;
                if (member.voice.channel) {
                    await member.roles.remove(vmuteRol)
                    await member.voice.setMute(false).catch();
                    vmuteInterval.deleteOne({userID: memberdata.userID}).exec()
                }
            }
        })

        let vkcezalı = await vkInterval.find({
            "vktype": true,
            "endDate": {
                $lte: Date.now()
            }
        });
        vkcezalı.forEach(async memberdata => {
            if (!sunucu) return;
            if (!sunucu.members.cache.has(memberdata.userID)) {
                vkInterval.deleteOne({userID: memberdata.userID}).exec()
            } else {
                let member = sunucu.members.cache.get(memberdata.userID)
                if (!member) return;
                member.roles.remove(VKCEZALI)
                vkInterval.deleteOne({userID: member.id}).exec()
            }
        });

        let dccezalı = await dcInterval.find({
            "dctype": true,
            "endDate": {
                $lte: Date.now()
            }
        });
        dccezalı.forEach(async memberdata => {
            if (!sunucu) return;
            if (!sunucu.members.cache.has(memberdata.userID)) {
                dcInterval.deleteOne({userID: memberdata.userID}).exec()
            } else {
                let member = sunucu.members.cache.get(memberdata.userID)
                if (!member) return;
                member.roles.remove(DCCEZALI)
                dcInterval.deleteOne({userID: member.id}).exec()
            }
        });

        let stcezalı = await stInterval.find({
            "sttype": true,
            "endDate": {
                $lte: Date.now()
            }
        });
        stcezalı.forEach(async memberdata => {
            if (!sunucu) return;
            if (!sunucu.members.cache.has(memberdata.userID)) {
                stInterval.deleteOne({userID: memberdata.userID}).exec()
            } else {
                let member = sunucu.members.cache.get(memberdata.userID)
                if (!member) return;
                member.roles.remove(STCEZALI)
                stInterval.deleteOne({userID: member.id}).exec()
            }
        });

        let tagveri = await tagInterval.find({authorID: "x"});
        tagveri.forEach(async user => {
            if (Date.now() - user.Tarih >= 1000 * 60 * 3) {
                tagInterval.deleteOne({authorID: "x"}).exec();
            }
        })
    }, 5000)

});



client.login(mainSettings.ASYNC).catch(err => console.log("Token bozulmuş lütfen yeni bir token girmeyi dene"));

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
