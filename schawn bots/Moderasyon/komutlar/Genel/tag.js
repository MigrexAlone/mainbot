const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar;
const sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
        let data = await sunucuayar.findOne({guildID: message.guild.id})
        message.channel.send(`${data.TAG}`);
}
exports.conf = {aliases: ["tag"]}
exports.help = {name: 'Tag'}
