const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let moment = require("moment")
moment.locale("tr");
let ms = require("ms");
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
let profil = require("../../models/profil");
let reklamInterval = require("../../models/reklamInterval");
var limit = new Map(); 
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let jailSorumlusu = data.REKLAMAuthorized;
    let reklamLOGKanal = data.REKLAMChannel;
    let REKLAMLimit = data.REKLAMLimit;
    let cezaID = data.WARNID;
    let reklamROL = data.REKLAM;
    let booster = data.BOOST
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
                    return data.REKLAMAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.REKLAMChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.REKLAMLimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    }
    if (await client.permAyar(message.author.id, message.guild.id, "reklam") || durum) {
        if (jailSorumlusu.length >= 1 && client.channels.cache.get(reklamLOGKanal) && REKLAMLimit >= 1) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            let reason = "Reklam";
            if (!target) return client.Embed(message.channel.id, `Lütfen bir kişi belirtiniz`);
            if (target.roles.cache.get(reklamROL)) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
            if (limit.get(message.author.id) >= REKLAMLimit) return message.reply(`\`jail komutu için limite ulaştın!\``);
            if (message.member.roles.highest.position <= target.roles.highest.position) return client.Embed(message.channel.id, `Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)
            if (target.id === message.author.id) return;

            let messageEmbed = `${target} Üyesi Sunucudan **${reason}** sebebiyle ${message.author} Tarafından reklam cezası yedi! **Ceza Numarası:** (\`#${cezaID+1}\`)`
            let messageLogEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setFooter(conf.footer)
                .setTimestamp()
                .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Reklam Yapan Üye: ${target} (\`${target.id}\`)
• Yetkili: ${message.author} (\`${message.author.id}\`)
• Reklam Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Ceza Sebebi: [\`${reason}\`]
`)
            reklamInterval.findOne({userID: target.id}, (err,data) => {
                if (!data) {
                    newData = new reklamInterval({
                        userID: target.id,
                        reklam: true,
                    })
                    newData.save()
                } else {
                    data.reklam = true,data.save();
                }
            });
            limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
            setTimeout(() => {
                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
            },1000*60*3)
            bahadırınAmk(target, booster, reklamROL, message, messageEmbed, client, reklamLOGKanal, messageLogEmbed, cezaID, reason);

        } else return client.Embed(message.channel.id, "Lütfen reklam komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "reklam setup` yazarak kurunuz!")
    } else return;
}
exports.conf = {
    aliases: ["Reklam"]
}
exports.help = {
    name: 'reklam'
}

function bahadırınAmk(target, booster, reklamROL, message, messageEmbed, client, reklamLOGKanal, messageLogEmbed, cezaID, reason) {
    target.setNickname("Reklamcı");
    target.roles.set(target.roles.cache.get(booster) ? [reklamROL, booster] : [reklamROL])
        message.channel.send(messageEmbed);
        client.channels.cache.get(reklamLOGKanal).send(messageLogEmbed);
        let newData = ceza({
            ID: cezaID + 1,
            userID: target.id,
            Yetkili: message.author.id,
            Ceza: "REKLAM",
            Sebep: reason,
            Puan: 0,
            Atilma: Date.now(),
            Bitis: "null",
        });
        client.savePunishment();
        newData.save();
}
