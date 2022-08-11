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
let muteInterval = require("../../models/muteInterval");
let jailInterval = require("../../models/jailInterval");
let vmuteInterval = require("../../models/vmuteInterval");
var limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let cezaID = data.WARNID;

    if (!(await client.permAyar(message.author.id, message.guild.id, "mute")) && !durum && !(await client.permAyar(message.author.id, message.guild.id, "vmute"))) return;

    if (sec == "mutesetup") {
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
                    return data.MUTEAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.MUTEChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.MUTELimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    } else if (sec == "vmutesetup") {
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
                    return data.VMUTEAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.VMUTEChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.VMuteLimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    } else {
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.splice(2).join(" ") || "Sebep Yok";
        let time = args[1];
        if (!target) return client.Embed(message.channel.id, `Lütfen bir kişi belirtiniz`)
        if (!time) return client.Embed(message.channel.id, `Lütfen bir süre belirtiniz`)
        let cezalar = await ceza.find({
            userID: target.id
        });
        if (cezalar.length == 0) {
            cezalar = [{
                Puan: 0
            }, {
                Puan: 0
            }];
        };

        

        await message.react(`${client.emojis.cache.find(x => x.name === "schawn_mute")}`);
        await message.react(`${client.emojis.cache.find(x => x.name === "schawn_vmute")}`);

        const filter = (reaction, user) => {
            return ["schawn_mute", "schawn_vmute"].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        const collector = message.createReactionCollector(filter, {
            max: 1,
            time: 30000,
            error: ['time']
        });

        collector.on("collect", async (reaction) => {
            message.reactions.removeAll();
            message.react(`${client.emojis.cache.find(x => x.name === "schawn_tik")}`);
            if (reaction.emoji.name == "schawn_mute") {
                if (await client.permAyar(message.author.id, message.guild.id, "mute") || durum) {
                    let muteSorumlusu = data.MUTEAuthorized;
                    let muteLogKanal = data.MUTEChannel;
                    let muteLimit = data.MUTELimit;
                    let muteROL = data.MUTED;
                    if (muteSorumlusu.length >= 1 && client.channels.cache.get(muteLogKanal) && muteLimit >= 1) {
                        if (target.roles.cache.get(muteROL)) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                        if (limit.get(`${message.author.id}`) >= muteLimit) return message.reply(`\`mute komutu için limite ulaştın!\``);
                        if (message.member.roles.highest.position <= target.roles.highest.position) return client.Embed(message.channel.id, `Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)
                        if (target.id === message.author.id) return client.Embed(message.channel.id, `Kendine mute atamazsın!`)

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

                        let messageEmbed = `${target} Üyesi Sunucudan **${reason}** sebebiyle ${message.author} Tarafından **${args[1].replace("h", " saat").replace("m", " dakika").replace("s", " saniye")} mute** cezası yedi! **Ceza Numarası:** (\`#${cezaID+1}\`) \`✅\``
                        let messageLogEmbed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.tag, message.author.avatarURL({
                                dynamic: true
                            }))
                            .setFooter(conf.footer)
                            .setTimestamp()
                            .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Mutelenen Üye: ${target} (\`${target.id}\`)
• Muteleyen Yetkili: ${message.author} (\`${message.author.id}\`)
• Mute Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Mute Bitiş Tarihi: \`${moment(Date.now()+ms(args[1])).format('LLL')}\`
• Mute Sebebi: [\`${reason}\`]
`)
                        await muteInterval.findOne({
                            userID: target.id,
                        }, async (err, data) => {
                            if (!data) {
                                let newData = new muteInterval({
                                    userID: target.id,
                                    muted: true,
                                    endDate: Date.now() + ms(time)
                                })
                                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                                setTimeout(() => {
                                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                                }, 1000 * 60 * 3)
                                await newData.save()
                                await banSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar);

                            } else {
                                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                                setTimeout(() => {
                                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                                }, 1000 * 60 * 3)
                                data.muted = true, data.endDate = Date.now() + ms(time), data.save();
                                await banSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar);
                            }
                        })
                    } else return client.Embed(message.channel.id, "Lütfen mute komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "vmute setup` yazarak kurunuz!")
                } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici - Mute Sorumlusu olmalısın!`)
            } else if (reaction.emoji.name == "schawn_vmute") {
                if (await client.permAyar(message.author.id, message.guild.id, "vmute") || durum) {
                    let muteSorumlusu = data.VMUTEAuthorized;
                    let muteLogKanal = data.VMUTEChannel;
                    let muteLimit = data.VMuteLimit;
                    let muteROL = data.VMUTED;
                    if (muteSorumlusu.length >= 1 && client.channels.cache.get(muteLogKanal) && muteLimit >= 1) {
                        if (limit.get(`${message.author.id}`) >= muteLimit) return message.reply(`\`voice mute komutu için limite ulaştın!\``);
                        if (target.roles.cache.get(muteROL)) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                        if (message.member.roles.highest.position <= target.roles.highest.position) return client.Embed(message.channel.id, `Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)
                        if (target.id === message.author.id) return client.Embed(message.channel.id, `Kendine mute atamazsın!`)

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

                        let messageEmbed = `${target} Üyesi Sunucudan **${reason}** sebebiyle ${message.author} Tarafından **${args[1].replace("h", " saat").replace("m", " dakika").replace("s", " saniye")} ses mute** cezası yedi! **Ceza Numarası:** (\`#${cezaID+1}\`) \`✅\``

                        let messageLogEmbed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.tag, message.author.avatarURL({
                                dynamic: true
                            }))
                            .setFooter(conf.footer)
                            .setTimestamp()
                            .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Ses Mutelenen Üye: ${target} (\`${target.id}\`)
• Ses Muteleyen Yetkili: ${message.author} (\`${message.author.id}\`)
• Ses Mute Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Ses Mute Bitiş Tarihi: \`${moment(Date.now()+ms(args[1])).format('LLL')}\`
• Ses Mute Sebebi: [\`${reason}\`]
`)
                        await vmuteInterval.findOne({
                            userID: target.id,
                        }, async (err, data) => {
                            if (!data) {
                                let newData = new vmuteInterval({
                                    userID: target.id,
                                    muted: true,
                                    endDate: Date.now() + ms(time)
                                })
                                await newData.save()
                                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                                setTimeout(() => {
                                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                                }, 1000 * 60 * 3)
                                await voiceMuteSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar);
                                await client.toplama(cezalar, client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 10);
                            } else {
                                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
                                setTimeout(() => {
                                    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
                                }, 1000 * 60 * 3)
                                data.muted = true, data.endDate = Date.now() + ms(time), data.save();
                                await voiceMuteSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar);

                            }
                        })
                    } else return client.Embed(message.channel.id, "Lütfen mute komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "vmute setup` yazarak kurunuz!")
                } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici - Mute Sorumlusu olmalısın!`)
            }
        })
    }
}
exports.conf = {
    aliases: ["Mute", "muted", "sustur", "keslan", "VMute", "vmuted", "sesmute", "voicemute", "voice-mute", "vmute"]
}
exports.help = {
    name: 'mute'
}
async function banSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar) {
    await target.roles.add(muteROL).then(async x => {
        await message.channel.send(messageEmbed);
        await client.channels.cache.get(muteLogKanal).send(messageLogEmbed);
        let newData = ceza({
            ID: cezaID + 1,
            userID: x.id,
            Yetkili: message.author.id,
            Ceza: "MUTE",
            Sebep: reason,
            Puan: 8,
            Atilma: Date.now(),
            Bitis: Date.now() + ms(args[1]),
        })
        profil.updateOne({
            userID: message.author.id,
            guildID: message.guild.id
        }, {
            $inc: {
                MuteAmount: 1
            }
        }, {
            upsert: true
        }).exec();
        await client.savePunishment();
        await newData.save();
        await client.toplama(cezalar, client.ayarlar.CEZA_PUAN_KANAL, x.id, cezaID, 10);
    })
}
async function voiceMuteSistemi(message, messageEmbed, client, muteLogKanal, messageLogEmbed, target, cezaID, reason, args, ms, muteROL, cezalar) {
    await target.roles.add(muteROL).then(async x => {
        await message.channel.send(messageEmbed);
        await client.channels.cache.get(muteLogKanal).send(messageLogEmbed);
        let newData = new ceza({
            ID: cezaID + 1,
            userID: x.id,
            Yetkili: message.author.id,
            Ceza: "SES MUTE",
            Sebep: reason,
            Puan: 10,
            Atilma: Date.now(),
            Bitis: Date.now() + ms(args[1]),
        });
        await profil.updateOne({
            userID: message.author.id,
            guildID: message.guild.id
        }, {
            $inc: {
                MuteAmount: 1
            }
        }, {
            upsert: true
        }).exec();
        await client.savePunishment();
        await newData.save();
        await x.voice.setMute(true).catch(() => {});
        await client.toplama(cezalar, client.ayarlar.CEZA_PUAN_KANAL, x.id, cezaID, 10);
    })
}