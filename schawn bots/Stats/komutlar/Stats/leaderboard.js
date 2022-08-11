const {
    MessageEmbed
} = require("discord.js");
const Stat = require("../../models/stats");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    
    /**
     * @param client
     * @param message
     * @param args
     */

    let data = await Stat.find({}, {messageXP: 0, _id: 0, __v: 0,ondort: 0,total: 0, yirmibir: 0, yirmisekiz: 0, otuzbes: 0, messageCategory: 0, voiceChannel: 0, voiceCategory: 0, messageChannel: 0});
    let statemoji = client.emojis.cache.find(x => x.name === "schawn_stat");

    let göster = data.map(x => {
        return {
            Id: x.userID,
            mLevel: x.messageLevel,
            sLevel: x.voiceLevel,
            total: x.messageLevel+x.voiceLevel
        }
    }).sort((a, b) => b.total - a.total).map((user, index) => `${statemoji} <@${user.Id}> (\`Mesaj: ${user.mLevel} - Ses: ${user.sLevel}\`)`).splice(0,10)
    message.channel.send(new MessageEmbed().setColor("65D1F4").setFooter(`${message.guild.name} Sunucusuna ait level sıralaması yukarıda belirtildiği gibidir.`).setTitle("Top 10 Ses / Mesaj Level Sıralaması").setThumbnail("https://cdn.discordapp.com/attachments/812041454754201621/813246369435353108/808633786945634314.gif").setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setDescription(`${göster.join("\n")}`))

}
exports.conf = {aliases: ["leveltop"]}
exports.help = {name: 'Leveltop'}
