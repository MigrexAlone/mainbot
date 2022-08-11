let xpData = require("../../models/stafxp");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    if (message.member.permissions.has(8) || durum) {
        let data = await sunucuayar.findOne({guildID: message.guild.id});
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!target) return message.reply("Lütfen bir kullanıcı etiketleyiniz.");
        if (!args[1]) return message.reply("Lütfen bir puan ekleyiniz");
        if (args[1] > 250 && !data.GKV.includes(message.author.id)) return message.reply("250 üzeri puan ekleyemezsin.")

        xpData.updateOne({userID: target.id}, {$inc: {currentXP: Number(args[1])}}, {upsert: true}).exec();
        message.channel.send(`Başarılı bir şekilde ${target} adlı üyeye ${args[1]} puan eklediniz.`)

    } else return;
}
exports.conf = {
    aliases: ["bonus"]
}
exports.help = {
    name: 'puanekle'
}