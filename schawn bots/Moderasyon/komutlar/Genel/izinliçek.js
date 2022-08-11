const { MessageEmbed, Discord } = require("discord.js");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
  if (!message.member.voice.channel) return message.channel.send(`Bir ses kanalında olman gerek`);
  if (!message.mentions.members.first()) {
      return message.reply(`Bir kullanıcı etiketlemelisin`);
      };
  let target = message.guild.members.cache.get(message.mentions.members.first().id);
  if (!target.voice.channel) return message.channel.send("Bu Kullanıcı Bir Ses Kanalında Değil");
  if (message.member.voice.channel.id === target.voice.channel.id) return message.channel.send("Zaten Aynı Kanaldasınız.");
    let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(conf.footer)

    const reactionFilter = (reaction, user) => {
            return ['✅'].includes(reaction.emoji.name) && user.id === target.id;
          };
          message.channel.send(`${target}`, {embed: embed.setAuthor(target.displayName, target.user.avatarURL({dynamic: true, size: 2048})).setDescription(`${message.author} seni ses kanalına çekmek için izin istiyor! Onaylıyor musun?`)}).then(async msj => {
            await msj.react('✅');
            msj.awaitReactions(reactionFilter, {max: 1, time: 1000*15, error: ['time']}).then(c => {
              let cevap = c.first();
        if (cevap) {
          target.voice.setChannel(message.member.voice.channelID);
                msj.delete();
                message.react("✅").catch();
        };
            });
          });
}
exports.conf = {aliases: ["izinlicek", "İzinliçek", "İzinlicek"]}
exports.help = {name: 'izinliçek'}
