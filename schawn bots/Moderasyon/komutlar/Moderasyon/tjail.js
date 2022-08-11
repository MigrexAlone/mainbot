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
var limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let JailSorumlusu = data.JAILAuthorized;
    let JailLogKanal = data.JAILChannel;
    let JailLimit = data.JAILLimit;
    let cezaID = data.WARNID;
    let JailROL = data.JAIL;
    let booster = data.BOOST;

    if (sec == "setup") {
        if (!args[1]) return message.reply("Lütfen `yetki-kanal-limit` belirleyiniz")
        if (message.guild.members.cache.some(member => conf.sahip.some(sahip => member === sahip)) || message.member.permissions.has(8) || message.author.id === message.guild.owner.id) {
            await sunucuayar.findOne({
                guildID: message.guild.id
            }, async (err, data) => {
                if (args[1] == "yetki") {
                    let select;
                    if (message.mentions.roles.size >= 1) {
                        select = message.mentions.roles.map(r => r.id);
                    } else {
                        if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                        select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                    }
                    return data.JAILAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.JAILChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.JAILLimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    }

    if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
        if (JailSorumlusu.length >= 1 && client.channels.cache.get(JailLogKanal) && JailLimit >= 1) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            let reason = args.splice(2).join(" ") || "Sebep Yok";
            let time = args[1];
            if (!target) return client.Embed(message.channel.id, `Lütfen bir kişi belirtiniz`)
            if (!time) return client.Embed(message.channel.id, `Lütfen bir süre belirtiniz`)
            if (target.roles.cache.get(JailROL)) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
            if (limit.get(`${message.author.id}`) >= JailLimit) return message.reply(`\`Jail komutu için limite ulaştın!\``);
            if (message.member.roles.highest.position <= target.roles.highest.position) return client.Embed(message.channel.id, `Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)
            if (target.id === message.author.id) return client.Embed(message.channel.id, `Kendine Jail atamazsın!`)
            let cezalar = await ceza.find({userID: target.id});
            if (cezalar.length == 0) {
                cezalar = [{Puan: 0}, {Puan: 0}];
            };

            if (client.ayarlar.CEZA_PUAN_SYSTEM == true) {

                if (cezalar.map(x => x.Puan).reduce((a, b) => a + b) >= 200) {
                    await jailInterval.findOne({
                        userID: target.id
                    }, (err, data) => {
                        if (!data) {
                            newData = new jailInterval({
                                userID: target.id,
                                jailed: true,
                            })
                            newData.save()
                        } else {
                            data.jailed = true, data.save();
                        }
                    })
                    await target.roles.set(target.roles.cache.get(data.BOOST) ? [data.JAIL, data.BOOST] : [data.JAIL]);
                    return message.channel.send(`${target.id} adlı üye **200 Ceza Puan'ı** yaptığı için cezalı üyelerin arasına gönderildi!`)
                }
            }

            let messageEmbed = `${target} Üyesi Sunucudan **${reason}** sebebiyle ${message.author} Tarafından **${args[1].replace("h", " saat").replace("m", " dakika").replace("s", " saniye")} jail** cezası yedi! **Ceza Numarası:** (\`#${cezaID+1}\`) \`✅\``
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
• Ceza Bitiş Tarihi: \`${moment(Date.now()+ms(time)).format('LLL')}\`
• Ceza Sebebi: [\`${reason}\`]
`)
            await jailInterval.findOne({
                userID: target.id,
            }, async (err, data) => {
                if (!data) {
                    let newData = new jailInterval({
                        userID: target.id,
                        jailed: true,
                        endDate: Date.now() + ms(time)
                    })
                    newData.save()
                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                    setTimeout(() => {
                        limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                    },1000*60*3)
                    await banSistemi(message, messageEmbed, client, JailLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, JailROL, data);
                    await client.toplama(cezalar,client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 15);
                } else {
                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                    setTimeout(() => {
                        limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                    },1000*60*3)
                    data.jailed = true, data.endDate = Date.now() + ms(time), data.save();
                    await banSistemi(message, messageEmbed, client, JailLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, JailROL, data);
                    await client.toplama(cezalar,client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 15);
                    
                }
            })
        } else return client.Embed(message.channel.id, "Lütfen Jail komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "vJail setup` yazarak kurunuz!")
    } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici - Mute Sorumlusu olmalısın!`)
}
exports.conf = {
    aliases: ["tempjail", "tjail", "Tempjail"]
}
exports.help = {
    name: 'TJail'
}
async function banSistemi(message, messageEmbed, client, JailLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, JailROL, booster) {
    target.roles.set(target.roles.cache.get(booster) ? [JailROL, booster] : [JailROL]).then(async () => {
        message.channel.send(messageEmbed);
        client.channels.cache.get(JailLogKanal).send(messageLogEmbed);
            let newData = ceza({
                ID: cezaID + 1,
                userID: target.id,
                Yetkili: message.author.id,
                Ceza: "JAIL",
                Sebep: reason,
                Puan: 15,
                Atilma: Date.now(),
                Bitis: Date.now() + ms(args[1]),
            })
            profil.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {JailAmount: 1}}, {upsert: true}).exec()
            await client.savePunishment();
            newData.save();
    });
}
