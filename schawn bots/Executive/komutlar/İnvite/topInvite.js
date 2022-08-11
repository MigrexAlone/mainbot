const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let Database = require("../../models/invite");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    let data = await Database.find({});

    data = data.map(user => {
        return {
            Id: user.userID,
            Total: user.bonus+user.regular,
            Regular: user.regular,
            Bonus: user.bonus,
            Fake: user.fake
        }
    }).sort((a,b) => b.Total - a.Total).map((data, index)=> `\`${index+1}.\` <@!${data.Id}> (\`Toplam: ${data.Total} Regular: ${data.Regular} Bonus: ${data.Bonus} Fake: ${data.Fake}\`)`).splice(0,25).join("\n")
    let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(conf.footer)
    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
    .setDescription(`**${message.guild.name}** adlı sunucunun top 25 davet istatistikleri\n\n${data}`)
    message.channel.send(embed)
}
exports.conf = {aliases: ["topdavet", "toprank"]}
exports.help = {name: 'topinvite'}