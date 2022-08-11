const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let moment = require("moment")
moment.locale("tr");
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
var limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let banSorumlusu = data.BANAuthorized
    let banLogKanal = data.BANChannel
    let banLimit = data.BANLimit
    let cezaID = data.WARNID;
    if (durum || data.GKV.includes(message.author.id)) {
        if (banSorumlusu.length >= 1 && client.channels.cache.get(banLogKanal) && banLimit >= 1) {


            await client.users.fetch(args[0]).then(async user => {
                if (!user) {
                    return message.channel.send("**HATA:** Lütfen bir kişi ID'si giriniz.").then(x => x.delete({
                        timeout: 5000
                    }).catch()).catch();
                } else {
                    let reason = args.slice(1).join(" ");
                    if (!reason) return message.channel.send("**HATA:** Lütfen geçerli bir sebep belirtiniz. `Örneğin: Ailevi Küfür`").then(x => x.delete({
                        timeout: 5000
                    }).catch()).catch();
                    message.guild.fetchBans(true).then(async (bans) => {
                        let messageLogEmbed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.tag, message.author.avatarURL({
                                dynamic: true
                            }))
                            .setFooter(conf.footer)
                            .setTimestamp()
                            .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Yargılanan Üye: ${user.tag} (\`${user.id}\`)
• Yargılayan Yetkili: ${message.author} (\`${message.author.id}\`)
• Yargılama Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Yargılama Sebebi: [\`${reason}\`]
`)



                        message.channel.send(`**${user.tag}** kişi ${message.author} adlı kişi tarafından kedilere yem edildi!`, {
                            files: ["https://cdn.discordapp.com/attachments/804435737872302180/806649483861557258/s-35f37eb320b6f898380ccf349e3ce841cbb5526b.gif"]
                        })
                        client.channels.cache.get(banLogKanal).send(messageLogEmbed).catch();
                        message.guild.members.ban(user.id, {
                            reason: `${reason} | Yetkili: ${message.author.tag}`
                        }).catch();
                        limit.set(message.author.id, (Number(limit.get(message.author.id) || 0)) + 1);
                        let yargıBAN = new ceza({
                            ID: cezaID + 1,
                            userID: user.id,
                            Yetkili: message.author.id,
                            Ceza: "YARGI",
                            Sebep: reason,
                            Puan: 0,
                            Atilma: Date.now(),
                            Bitis: "null",
                        });
                        await client.savePunishment();
                        await yargıBAN.save();
                        setTimeout(() => {
                            limit.set(message.author.id, (Number(limit.get(message.author.id) || 0)) - 1);
                        }, 1000 * 60 * 3);
                    }).catch(() => message.channel.send("**HATA:** Lütfen bir kişi ID'si giriniz.").then(x => x.delete({
                        timeout: 5000
                    }).catch()).catch())
                }
            }).catch(() => message.channel.send("**HATA:** Lütfen bir kişi ID'si giriniz.").then(x => x.delete({
                timeout: 5000
            }).catch()).catch())

        } else return;
    } else return;
}
exports.conf = {
    aliases: ["Yargı", "Yargi", "yargi"]
}
exports.help = {
    name: 'yargı'
}