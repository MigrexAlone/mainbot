let Stat = require("../models/stats");
let StaffXP = require("../models/stafxp");
let randMiss = require("../models/randomMission");
let sunucuayar = require("../models/sunucuayar");
let muteInterval = require("../models/muteInterval");
module.exports = async message => {
  if (!message.guild) return
  if (message.author.bot) return;

  let sunucuData = await sunucuayar.findOne({guildID: message.guild.id});
  let muteRol = sunucuData.MUTED;
  let check = await muteInterval.findOne({userID: message.author.id});
  if (check && !message.member.roles.cache.get(muteRol)) {
    message.member.roles.add(muteRol)
  }
    await client.checkLevel(message.author.id, client.ayarlar.sunucuId, "mesaj")
    let data = await randMiss.findOne({userID: message.author.id}) || {Mission: {MISSION: null, CHANNEL: null}};
    if (data.Mission.MISSION == "mesaj" && data.Mission.CHANNEL == message.channel.id) {
      await client.dailyMission(message.author.id, "mesaj", 1)
    }
    addMessageStat(message.author.id, message.channel.id, 1, message.channel.parentID || "nocategory");
};
function addMessageStat(id, channel, value, category) {
  let randomMessageXP = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].random();
  let randomcoinXP = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09].random();

  Stat.findOne({userID: id, guildID: client.ayarlar.sunucuId}, (err, res) => {
    if (!res) {
      let newData = new Stat({userID: id,guildID: client.ayarlar.sunucuId,yedi: {Id: id,Invite: 0,Chat: {},Voice: {},TagMember: 0,Man: 0,Woman: 0}});
      newData.save();
    } else {
      Stat.updateOne({ userID: id, guildID: client.ayarlar.sunucuId}, { $inc: { messageXP: randomMessageXP, coin: (randomcoinXP).toFixed(3), totalMessage: value, [`messageChannel.${channel}`]: value, [`messageCategory.${category}`]: value, [`yedi.Chat.${channel}`]: value} }, { upsert: true }).exec();
      let siradakilevel = res.messageLevel * 643;
      if (siradakilevel <= res.messageXP) {
        res.messageLevel++
      }
      res.save();
    };
  });
  return;
};
