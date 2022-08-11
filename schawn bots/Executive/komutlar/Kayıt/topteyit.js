const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let teyit = require("../../models/stats");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    let data = await sunucuayar.findOne({});
    let kayitSorumlusu = data.REGISTERAuthorized;
    if (message.member.permissions.has(8) || message.guild.roles.cache.some(rol => kayitSorumlusu.some(rol2 => rol === rol2)) || durum) {


        let data = await teyit.find({});
        data = data.map(veri => {
            return {
                Id: veri.yedi.Id,
                Total: veri.yedi.Man+veri.yedi.Woman,
                Erkek: veri.yedi.Man,
                Kadin: veri.yedi.Woman
            }
        }).sort((a, b) => b.Total - a.Total).map((user, index) => `\`${index+1}.\` <@${user.Id}> (\`Erkek: ${user.Erkek} Kadin: ${user.Kadin} Toplam: ${user.Total}\`)`).splice(0, 30).join("\n")

        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(conf.footer)
            .setAuthor(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setDescription(`**${message.guild.name}** adlı sunucunun top 30 teyit istatistikleri\n\n${data}`)
        message.channel.send(embed)



    } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici ya da Kayıt Sorumlusu olmalısın`)
}
exports.conf = {
    aliases: ["teyittop", "topteyit"]
}
exports.help = {
    name: 'teyittop'
}