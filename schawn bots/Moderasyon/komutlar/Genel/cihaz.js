
const { MessageEmbed, Discord } = require("discord.js");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (!message.member.hasPermission("VIEW_AUDIT_LOG")) return
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(client.randomColor()).setTimestamp();
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (member.presence.status === "offline") return message.channel.send(embed.setDescription(`${member} üyesi çevrim dışı!`));
    let clientStatus = member.presence.clientStatus;
    message.channel.send(embed.setDescription(`${member} üyesinin şu anki cihazları;\n\n${Object.keys(member.presence.clientStatus).map(c => `\`•\` ${c.replace("desktop", "Masaüstü Uygulaması").replace("mobile", "Mobil Cihaz").replace("web", "İnternet Tarayıcısı")} (${clientStatus[c].replace("idle", "Çevrim içi").replace("dnd", "Rahatsız etmeyin").replace("idle", "Boşta")})`).join("\n")}`));
  
}
exports.conf = {aliases: ["cihaz"]};
exports.help = {name: 'Cihaz'};

