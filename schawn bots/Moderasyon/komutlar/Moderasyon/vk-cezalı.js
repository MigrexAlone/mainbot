const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let moment = require("moment")
moment.locale("tr");
let ms = require("ms");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
let profil = require("../../models/profil");
let jailInterval = require("../../models/jailInterval");
let vkInterval = require("../../models/vkInterval");
var limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let data = await sunucuayar.findOne({})
    let cezaID = data.WARNID;
    let JailROL = data.VKCEZALI;

    if (durum) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            let reason = args.splice(2).join(" ") || "Sebep Yok";
            let time = args[1];
            if (!target) return client.Embed(message.channel.id, `Lütfen bir kişi belirtiniz`)
            if (!time) return client.Embed(message.channel.id, `Lütfen bir süre belirtiniz`)
            if (target.roles.cache.get(JailROL)) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
            if (limit.get(`${message.author.id}`) >= 3) return message.reply(`\`VK-Cezalı komutu için limite ulaştın!\``);
            if (target.id === message.author.id) return client.Embed(message.channel.id, `Kendine VK-Cezalı atamazsın!`)
            let cezalar = await ceza.find({userID: target.id});
            if (cezalar.length == 0) {
                cezalar = [{Puan: 0}, {Puan: 0}];
            };
            if (client.ayarlar.CEZA_PUAN_SYSTEM == true) {
                if (cezalar.map(x => x.Puan).reduce((a,b) => a+b) >= 200) {
                    await jailInterval.findOne({userID: target.id}, (err,data) => {
                        if (!data) {
                            newData = new jailInterval({
                                userID: target.id,
                                jailed: true,
                            })
                            newData.save()
                        } else {
                            data.endDate = null;
                            data.jailed = true,data.save();    
                        }
                    })
                    await target.roles.set(target.roles.cache.get(data.BOOST) ? [data.JAIL, data.BOOST] : [data.JAIL]);
                    return message.channel.send(`${target.id} adlı üye **200 Ceza Puan'ı** yaptığı için cezalı üyelerin arasına gönderildi!`)
                }
            }

            let messageEmbed = `${target} Üyesi Sunucudan **${reason}** sebebiyle ${message.author} Tarafından **${args[1].replace("h", " saat").replace("m", " dakika").replace("s", " saniye")} vk-cezalı** cezası yedi! **Ceza Numarası:** (\`#${cezaID+1}\`) \`✅\``
            let messageLogEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setFooter(conf.footer)
                .setTimestamp()
                .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Cezalanan Üye: ${target} (\`${target.id}\`)
• Cezalayan Yetkili: ${message.author} (\`${message.author.id}\`)
• Ceza Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Ceza Sebebi: [\`${reason}\`]
`)
            await vkInterval.findOne({
                userID: target.id,
            }, async (err, data) => {
                if (!data) {
                    let newData = new vkInterval({
                        userID: target.id,
                        vktype: true,
                        endDate: Date.now() + ms(time)
                    })
                    newData.save()
                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                    setTimeout(() => {
                        limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                    },1000*60*3)
                    await banSistemi(message, messageEmbed, client, messageLogEmbed, target, cezaID, reason, args, ms, JailROL, data);
                    await client.toplama(cezalar,client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 5);
                } else {
                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                    setTimeout(() => {
                        limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                    },1000*60*3)
                    data.vktype = true, data.endDate = Date.now() + ms(time), data.save();
                    await banSistemi(message, messageEmbed, client, messageLogEmbed, target, cezaID, reason, args, ms, JailROL, data);
                    await client.toplama(cezalar,client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 5);
                    
                }
            })
    } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici - Mute Sorumlusu olmalısın!`)
}
exports.conf = {
    aliases: ["vk-cezalı", "Vk-cezalı", "VK-Cezalı"]
}
exports.help = {
    name: 'vkcezalı'
}
async function banSistemi(message, messageEmbed, client, messageLogEmbed, target, cezaID, reason, args, ms, JailROL, booster) {
    await target.roles.add(target.roles.cache.get(booster) ? [JailROL, booster] : [JailROL]).then(async () => {
        await message.channel.send(messageEmbed);
        await client.channels.cache.find(x => x.name == "vk-cezali-log") ? client.channels.cache.find(x => x.name == "vk-cezali-log").send(messageLogEmbed) : ""
            let newData = ceza({
                ID: cezaID + 1,
                userID: target.id,
                Yetkili: message.author.id,
                Ceza: "VK-CEZA",
                Sebep: reason,
                Puan: 5,
                Atilma: Date.now(),
                Bitis: Date.now() + ms(args[1]),
            })
            await client.savePunishment();
            await newData.save();
    });
}
