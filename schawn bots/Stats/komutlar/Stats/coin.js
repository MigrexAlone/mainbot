const {
    MessageEmbed
} = require("discord.js");
const Stat = require("../../models/stats");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    

    let data = await Stat.findOne({userID: message.author.id});
    return message.reply(` ${data.coin.toFixed(0)} 🪙 coinin var`);
}
exports.conf = {aliases: ["coin"]}
exports.help = {name: 'Coin'}
