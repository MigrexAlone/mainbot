const {
  Collection
} = require("discord.js");
const Voices = global.Voices = new Collection();
const client = global.client;
const logs = require('discord-logs');
logs(client);
const Stat = require("../models/stats");
const StatCheck = require("../models/statscheck");
let StaffXP = require("../models/stafxp");
let sunucuayar = require("../models/sunucuayar");
let randMiss = require("../models/randomMission");
let vmuteInterval = require("../models/vmuteInterval");

client.on("ready", async () => {
  let channels = client.guilds.cache.get(client.ayarlar.sunucuId).channels.cache.filter(channel => channel.type == "voice" && channel.members.size > 0);
  channels.forEach(channel => {
      let members = channel.members.filter(member => !member.user.bot);
      members.forEach(member => {
        global.Voices.set(member.id, {
          parent: channel.parentID,
          channel: channel.id,
          start: Date.now()
      });
      });
  });
  setInterval(async () => {
     await check();
  }, 30000);
  async function check(){
    let voices = global.Voices
    voices.each(async (value, key) => {
      voices.set(key, {
        parent: value.parent,
        channel: value.channel,
        start: Date.now()
    });
        addVoiceStat(key, value.channel, (Date.now() - value.start), (Date.now() - value.start)/ 1000, value.parent);
        let gorev = await randMiss.findOne({userID: key}) || {Mission: {MISSION: null,CHANNEL: null}};
        if (!gorev) return;
        if (gorev.Mission.MISSION == "ses" && gorev.Mission.CHANNEL.includes(value.channel)) {
          await client.dailyMission(key, "ses", Date.now() - value.start)
        }
    });
}
})

client.on("ready", async () => {
  let data = await sunucuayar.findOne({
    guildID: client.ayarlar.sunucuId
  })
  let sunucu = client.guilds.cache.get(data.guildID);
  let rol = data.EnAltYetkiliRol
  setInterval(() => {
    sunucu.members.cache.filter(x => !x.user.bot && x.voice.channel && x.voice.channel.id != data.SLEEP && data.PUBCategory.includes(x.voice.channel.parentID) && x.roles.cache.get(rol)).map(user => {
      let data = client.channelTime.get(user.id)
      if (!data) return;
      if (Date.now() - data.time >= 1000 * 60 * 5 && data.deaf == true) {
        if (sunucu.members.cache.get(user.id).voice.deaf == false) return;
        user.voice.setChannel(data.SLEEP)
      }
    })
  }, 10000)
});

client.on("voiceChannelDeaf", (member, deafType) => {
  let sunucu = client.guilds.cache.get(client.ayarlar.sunucuId);
  client.channelTime.set(member.id, {
    channel: member.voice.channel.id,
    time: Date.now(),
    deaf: true
  })
});
client.on("voiceChannelUndeaf", (member, deafType) => {
  let sunucu = client.guilds.cache.get(client.ayarlar.sunucuId);
  client.channelTime.set(member.id, {
    channel: member.voice.channel.id,
    time: Date.now(),
    deaf: false
  })
});

client.on("voiceChannelJoin", async (member, channel) => {
  if (member.user.bot) return;
  if (!client.channelTime.has(member.id)) {
    client.channelTime.set(member.id, {
      channel: channel.id,
      time: Date.now(),
      deaf: member.voice.deaf == true ? true : false
    })
  }
    let sunucuData = await sunucuayar.findOne({
      guildID: client.ayarlar.sunucuId
    });
    let rol = sunucuData.VMUTED;
    let vmuted = await vmuteInterval.findOne({
      userID: member.id
    });
    let user = client.guilds.cache.get(client.ayarlar.sunucuId).members.cache.get(member.id).voice.serverMute;
    if (!vmuted && user) {
      member.roles.remove(rol).catch(() => {});
      member.voice.setMute(false).catch(() => {});
    } else if (vmuted && !user) {
      member.roles.add(rol).catch(() => {});
      member.voice.setMute(true).catch(() => {});
    }

    global.Voices.set(member.id, {
      parent: channel.parentID,
      channel: channel.id,
      start: Date.now()
  });
  await client.checkLevel(member.id, client.ayarlar.sunucuId, "ses")
});

client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {
  if (member.user.bot) return;
  if (client.channelTime.has(member.id)) {
    client.channelTime.set(member.id, {
      channel: newChannel.id,
      time: Date.now(),
      deaf: member.voice.deaf == true ? true : false
    })
  }
    let sunucuData = await sunucuayar.findOne({
      guildID: client.ayarlar.sunucuId
    });
    let rol = sunucuData.VMUTED;
    let vmuted = await vmuteInterval.findOne({
      userID: member.id
    });
    let user = client.guilds.cache.get(client.ayarlar.sunucuId).members.cache.get(member.id).voice.serverMute;
    if (!vmuted && user) {
      member.roles.remove(rol).catch(() => {});
      member.voice.setMute(false).catch(() => {});
    } else if (vmuted && !user) {
      member.roles.add(rol).catch(() => {});
      member.voice.setMute(true).catch(() => {});
    }

  let data = Voices.get(member.id)

  Voices.set(member.id, {
    parent: newChannel.parentID,
    channel: newChannel.id,
    start: Date.now()
});

  let duration = Date.now() - data.start;
  await client.checkLevel(member.id, client.ayarlar.sunucuId, "ses")
  addVoiceStat(member.id, data.channel, duration, duration / 1000, data.parent);
  
  let gorev = await randMiss.findOne({userID: member.id}) || {Mission: {MISSION: null,CHANNEL: null}};
  if (!gorev) return;
  if (gorev.Mission.MISSION == "ses" && gorev.Mission.CHANNEL.includes(newChannel.id)) {
    await client.dailyMission(member.id, "ses", duration)
  }
});

client.on("voiceChannelLeave", async (member, channel) => {
  if (member.user.bot) return;
  let gorev = await randMiss.findOne({
    userID: member.id
  }) || {
    Mission: {
      MISSION: null,
      CHANNEL: null
    }
  };
  if (client.channelTime.has(member.id)) {
    client.channelTime.delete(member.id)
  }
  let data = Voices.get(member.id)
  let duration = Date.now() - data.start;
  await client.checkLevel(member.id, client.ayarlar.sunucuId, "ses")
  addVoiceStat(member.id, data.channel, duration, duration / 1000, data.parent);
  if (!gorev) return Voices.delete(member.id);
  if (gorev.Mission.MISSION == "ses" && gorev.Mission.CHANNEL.includes(newChannel.id)) {
    await client.dailyMission(member.id, "ses", duration)
  }
  Voices.delete(member.id);
});

module.exports = async (oldState, newState) => {

};

function addVoiceStat(id, channel, value, xp, category) {
  let randomVoiceXP = ((Math.random() * 0.008) + 0.001).toFixed(3)
  let randomcoinXP = ((Math.random() * 0.008) + 0.001).toFixed(3)
  Stat.findOne({
    userID: id,
    guildID: client.ayarlar.sunucuId
  }, (err, res) => {
    if (!res) {
      let newData = new Stat({
        userID: id,
        guildID: client.ayarlar.sunucuId,
        yedi: {
          Id: id,
          Invite: 0,
          Chat: {},
          Voice: {},
          TagMember: 0,
          Man: 0,
          Woman: 0,
          Yetkili: 0
        }
      });
      newData.save();
    } else {
      Stat.updateOne({
        userID: id,
        guildID: client.ayarlar.sunucuId
      }, {
        $inc: {
          voiceXP: xp * randomVoiceXP,
          coin: (xp * randomcoinXP).toFixed(3),
          totalVoice: value,
          [`yedi.Voice.${channel}`]: value,
          [`voiceChannel.${channel}`]: value,
          [`voiceCategory.${category}`]: value
        }
      }, {
        upsert: true
      }).exec();
      let siradakilevel = res.voiceLevel * 643;
      if (siradakilevel <= res.voiceXP) {
        res.voiceLevel++
      }
      res.save();
    };
  });
};