
let sunucuayar = require("../../models/sunucuayar");
let randMiss = require("../../models/randomMission");
let moment = require("moment")
let puansystem = require("../../models/puansystem");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    if (!client.ayarlar.sahip.includes(message.author.id)) return;
      let dailyData = await puansystem.findOne({guildID: client.ayarlar.sunucuId}) || {DailyMission: {Type: false}};
           let arr = ["davet", "mesaj", "ses", "taglı", "teyit"];
          let dagit = []
          let enAltYetkiliRol = await sunucuayar.findOne({}).then(x => x.EnAltYetkiliRol);
          client.guilds.cache.get(client.ayarlar.sunucuId).roles.cache.get(enAltYetkiliRol).members.array().shuffle().forEach((x, index) => {
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

          let VoiceChannel = client.guilds.cache.get(client.ayarlar.sunucuId).channels.cache.filter(chan => chan.type == "voice" && kategoriler.includes(chan.parentID) && !yasaklıkanal.includes(chan.id)).map(channel => channel.id)
          let MessageChannel = client.guilds.cache.get(client.ayarlar.sunucuId).channels.cache.filter(chan => chan.type == "text" && messageKategori.includes(chan.id)).map(channel => channel.id)
          client.channels.cache.get(dailyData.DailyMission.logChannel).send(`\`\`\`${client.guilds.cache.get(client.ayarlar.sunucuId).name} ${moment(Date.now()).locale("tr").format("LLL")} tarihinde dağıtılan günlük görevler;\`\`\``);
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
                let VoiceRandom = VoiceChannel[Math.floor(Math.random() * VoiceChannel.length)];
                client.channels.cache.get(dailyData.DailyMission.logChannel).send(`<@${user.user}> Bugün <#${VoiceRandom}> kanalında \`${miktarlar}\` dakika ses aktifliği yapman gerekiyor.`);
                randMiss.updateOne({userID: user.user}, {$set: {userID: user.user, Check: 0, Mission: {ID: user.user, MISSION: user.gorev, AMOUNT: 1000*60*sesRandom, CHANNEL: VoiceRandom}}}, {upsert: true}).exec()
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
}
exports.conf = {aliases: ["gorevdagit", "görevdağıt"]}
exports.help = {name: 'görevdagit'}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
