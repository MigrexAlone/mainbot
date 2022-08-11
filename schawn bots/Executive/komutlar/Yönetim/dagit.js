
module.exports.run = (client, message, args, durum, kanal) => {
  
    if (durum) {
      let voiceChannel = message.member.voice.channelID;
      if (!voiceChannel) return message.reply("Herhangi bir ses kanalında değilsin!");
      let publicRooms = message.guild.channels.cache.filter(c => c.parentID === "758612765807083550" && c.type === "voice");
      message.member.voice.channel.members.array().forEach((m, index) => {
        setTimeout(() => {
           if (m.voice.channelID !== voiceChannel) return;
           m.voice.setChannel(publicRooms.random().id);
        }, index*1000);
      });
      message.reply(`\`${message.member.voice.channel.name}\` adlı ses kanalındaki üyeler rastgele public odalara dağıtılmaya başlandı!`);
    }
  };
  
  exports.conf = {
    aliases: ["dagit", "dağit"],
  }
  exports.help = {
    name: "dağıt"
  }