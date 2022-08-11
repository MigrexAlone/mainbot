const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    if (message.member.hasPermission('MANAGE_CHANNELS') || durum) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(x => x.name.match(new RegExp(args.join(' '), 'gi')));
    if (!args[0] || !role || role.id === message.guild.id) return global.reply(message, 'rol bulunamadı, bir rol belirt!');
    message.channel.send(`Rol: ${role.name} | ${role.id} (${role.members.size < 1 ? 'Bu rolde hiç üye yok!' : role.members.size})`, { code: 'xl' });
  message.channel.send(role.members.array().map((x) => x.toString()).join(', '), { code: 'xl', split: { char: ', ' } });

    } else return;
}
exports.conf = {
    aliases: ["rolsay"]
}
exports.help = {
    name: 'rolsay'
}