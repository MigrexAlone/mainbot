const {
    MessageEmbed
} = require("discord.js");
const Stat = require("../../models/stats");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    

    let data = await Stat.findOne({userID: message.author.id});
    let statemoji = client.emojis.cache.find(x => x.name === "schawn_deynek");
    message.delete()
    return message.reply(`Şuan da **${data.messageLevel} Chat** / **${data.voiceLevel} Ses** leveline sahipsin! ${statemoji}`);
}
exports.conf = {aliases: ["level"]}
exports.help = {name: 'Level'}
