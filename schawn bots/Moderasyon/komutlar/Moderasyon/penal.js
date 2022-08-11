
const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar;
let mongoose = require("mongoose");
let stringTabe = require("string-table");
let sunucuayar = require("../../models/sunucuayar");
let jailInterval = require("../../models/jailInterval");
let muteInterval = require("../../models/muteInterval");
let vmuteInterval = require("../../models/vmuteInterval");
let reklamInterval = require("../../models/reklamInterval");
let stInterval = require("../../models/stInterval");
let dcInterval = require("../../models/dcInterval");
let vkInterval = require("../../models/vkInterval");
let ceza = require("../../models/ceza");
let ms = require("ms");
let moment = require("moment");
moment.locale("tr")
let limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    

    
    if (!message.member.permissions.has(8)) return
    let data = await sunucuayar.findOne({})
    let penalLog = "808770270542036992";
    let cezaID = data.WARNID;
    let muteROL = [data.MUTED, data.VMUTED];
    let boost = data.BOOST;
    let jail = data.JAIL;
    let reklam = data.REKLAM;
    let vkcezalı = data.VKCEZALI;
    let dccezalı = data.DCCEZALI;
    let stcezalı = data.STCEZALI;
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply("Bir üye belirtiniz").then(x => x.delete({timeout: 50000}).catch()).catch();

    let embed = new MessageEmbed()
.setColor(`RANDOM`)
.setFooter(client.ayarlar.footer)
.setAuthor(target.user.tag, target.user.avatarURL({dynamic: true}))
.setDescription(`${target} Kişisinin cezasını, belirtilen emojiye tıklayarak seçiniz.

**Select Penal:**
\`\`\`
1️⃣ Sunucunun düzenini bozucak hal ve davranış
2️⃣ Din / Irkçılık / Siyaset
3️⃣ Tehdit / Şantaj / İftira atmak / Kandırmak
4️⃣ Uyarılara rağmen küfür ve troll
5️⃣ Reklam
6️⃣ Taciz
7️⃣ VK Oyun odasında Troll / Küfür
8️⃣ DC Oyun odasında Troll / Küfür
9️⃣ Streamer odalarında Troll / Küfür
🔟 Sunucuya hakaret
0️⃣ Sekmeyi kapat
\`\`\`
**Not:** \`Eğer sebep işlemi aşağıdaki seçeneklerin arasında yer almıyorsa bu penal sistemi uygun değildir!\`
`)
message.channel.send(embed).then(emoji => {
    emoji.react("1️⃣").then(async z => {
        emoji.react("2️⃣").then(async z => {
            emoji.react("3️⃣").then(async z => {
                emoji.react("4️⃣").then(async z => {
                    emoji.react("5️⃣").then(async z => {
                        emoji.react("6️⃣").then(async z => {
                            emoji.react("7️⃣").then(async z => {
                                emoji.react("8️⃣").then(async z => {
                                    emoji.react("9️⃣").then(async z => {
                                        emoji.react("🔟").then(async z => {
                                            emoji.react("0️⃣").then(async z => {
                                                const birinciFilter = (reaction, user) => reaction.emoji.name === "1️⃣" && user.id === message.author.id;
                                                const birinci = emoji.createReactionCollector(birinciFilter, { time: 1000*30 });
                                                const ikinciFilter = (reaction, user) => reaction.emoji.name === "2️⃣" && user.id === message.author.id;
                                                const ikinci = emoji.createReactionCollector(ikinciFilter, { time: 1000*30 });
                                                const üçüncüFilter = (reaction, user) => reaction.emoji.name === "3️⃣" && user.id === message.author.id;
                                                const üçüncü = emoji.createReactionCollector(üçüncüFilter, { time: 1000*30 });
                                                const dördüncüFilter = (reaction, user) => reaction.emoji.name === "4️⃣" && user.id === message.author.id;
                                                const dördüncü = emoji.createReactionCollector(dördüncüFilter, { time: 1000*30 });
                                                const beşinciFilter = (reaction, user) => reaction.emoji.name === "5️⃣" && user.id === message.author.id;
                                                const beşinci = emoji.createReactionCollector(beşinciFilter, { time: 1000*30 });
                                                const altıncıFilter = (reaction, user) => reaction.emoji.name === "6️⃣" && user.id === message.author.id;
                                                const altıncı = emoji.createReactionCollector(altıncıFilter, { time: 1000*30 });
                                                const yedinciFilter = (reaction, user) => reaction.emoji.name === "7️⃣" && user.id === message.author.id;
                                                const yedinci = emoji.createReactionCollector(yedinciFilter, { time: 1000*30 });
                                                const sekizinciFilter = (reaction, user) => reaction.emoji.name === "8️⃣" && user.id === message.author.id;
                                                const sekizinci = emoji.createReactionCollector(sekizinciFilter, { time: 1000*30 });
                                                const dokuzuncuFilter = (reaction, user) => reaction.emoji.name === "9️⃣" && user.id === message.author.id;
                                                const dokuzuncu = emoji.createReactionCollector(dokuzuncuFilter, { time: 1000*30 });
                                                const onuncuFilter = (reaction, user) => reaction.emoji.name === "🔟" && user.id === message.author.id;
                                                const onuncu = emoji.createReactionCollector(onuncuFilter, { time: 1000*30 });
                                                const sifirFilter = (reaction, user) => reaction.emoji.name === "0️⃣" && user.id === message.author.id;
                                                const sifir = emoji.createReactionCollector(sifirFilter, { time: 1000*30 });
                                            
                                                birinci.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    if (!limit.get(`birinci_${target.id}`)) {
                                                        limit.set(`birinci_${target.id}`, (Number(limit.get(`birinci_${target.id}`) || 0)) + 1)
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Sunucunun düzenini bozucak hal ve davranış\` sebebiyle uyarıldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Sunucunun düzenini bozucak hal ve davranış\` sebebiyle başarılı bir şekilde uyarıldı tekrarı halinde ceza-i işlem uygulanacak! (1)`);
                                                    }
                                                    if (limit.get(`birinci_${target.id}`) == 1) {
                                                        // rol verme
                                                        target.roles.add(muteROL)
                                                        // limit sistemi
                                                        limit.set(`birinci_${target.id}`, (Number(limit.get(`birinci_${target.id}`) || 0)) + 1)
                                                        setTimeout(() => {
                                                            limit.set(`birinci_${target.id}`, (Number(limit.get(`birinci_${target.id}`) || 0)) - 1)
                                                        },1000*60*120)
                                                        // ceza sistemi
                                                        await cezaVer(target.id, message.author.id, "MUTE", "Sunucunun düzenini bozucak hal ve davranış", 8, Date.now() + ms("20m"))
                                                        await cezaVer(target.id, message.author.id, "SES MUTE", "Sunucunun düzenini bozucak hal ve davranış", 10, Date.now() + ms("20m"))
                                                        muteInterval.updateOne({userID: target.id}, {$set: {userID: target.id, muted: true, endDate: Date.now()+ms("20m")}}, {upsert: true}).exec()
                                                        vmuteInterval.updateOne({userID: target.id}, {$set: {userID: target.id, muted: true, endDate: Date.now()+ms("20m")}}, {upsert: true}).exec()
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Sunucunun düzenini bozucak hal ve davranış\` sebebiyle 20 dakika mute/sesmute cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Sunucunun düzenini bozucak hal ve davranış\` sebebiyle başarılı bir şekilde cezalandırıldı (2)`)
                                                    }
                                                    if (limit.get(`birinci_${target.id}`) == 2) {
                                                        // rol verme
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        // limit sistemi
                                                        limit.set(`birinci_${target.id}`, (Number(limit.get(`birinci_${target.id}`) || 0)) + 1)
                                                        setTimeout(() => {
                                                            limit.set(`birinci_${target.id}`, (Number(limit.get(`birinci_${target.id}`) || 0)) - 1)
                                                        },1000*60*180)
                                                        // ceza sistemi
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Sunucunun düzenini bozucak hal ve davranış", 15, Date.now() + ms("3d"))
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: Date.now()+ms("3d")}}, {upsert: true}).exec()
                                                        // mesaj sistemi
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Sunucunun düzenini bozucak hal ve davranış\` sebebiyle 3 gün jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Sunucunun düzenini bozucak hal ve davranış\` sebebiyle başarılı bir şekilde cezalandırıldı (3)`)
                                                    }
                                                });
                                                ikinci.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    if (!limit.get(`ikinci_${target.id}`)) {
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        limit.set(`ikinci_${target.id}`, (Number(limit.get(`ikinci_${target.id}`) || 0)) + 1)
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Din / Irkçılık / Siyaset", 15, Date.now() + ms("3d"))
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: Date.now() + ms("3d")}}, {upsert: true}).exec()
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Din / Irkçılık / Siyaset\` sebebiyle 3 gün jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Din / Irkçılık / Siyaset\` sebebiyle başarılı bir şekilde cezalandırıldı (1)`);
                                                    
                                                    }
                                                    if (limit.get(`ikinci_${target.id}`) == 1) {
                                                        // rol verme
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        // limit sistemi
                                                        limit.set(`ikinci_${target.id}`, (Number(limit.get(`ikinci_${target.id}`) || 0)) + 1)
                                                        setTimeout(() => {
                                                            limit.set(`ikinci_${target.id}`, (Number(limit.get(`ikinci_${target.id}`) || 0)) - 1)
                                                        },1000*60*120)
                                                        // ceza sistemi
                                                        limit.set(`ikinci_${target.id}`, (Number(limit.get(`ikinci_${target.id}`) || 0)) + 1)
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Din / Irkçılık / Siyaset", 15, Date.now() + ms("7d"))
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: Date.now() + ms("7d")}}, {upsert: true}).exec()
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Din / Irkçılık / Siyaset\` sebebiyle 7 gün jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Din / Irkçılık / Siyaset\` sebebiyle başarılı bir şekilde cezalandırıldı (2)`)
                                                    }
                                                    if (limit.get(`ikinci_${target.id}`) == 2) {
                                                        // rol verme
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        // limit sistemi
                                                        limit.set(`ikinci_${target.id}`, (Number(limit.get(`ikinci_${target.id}`) || 0)) + 1)
                                                        setTimeout(() => {
                                                            limit.set(`ikinci_${target.id}`, (Number(limit.get(`ikinci_${target.id}`) || 0)) - 1)
                                                        },1000*60*180)
                                                        // ceza sistemi
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Din / Irkçılık / Siyaset", 15, "null")
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: null}}, {upsert: true}).exec()
                                                        // mesaj sistemi
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Din / Irkçılık / Siyaset\` sebebiyle sınırsız jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Din / Irkçılık / Siyaset\` sebebiyle başarılı bir şekilde cezalandırıldı (3)`)
                                                    }
                                                });
                                                üçüncü.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    if (!limit.get(`üçüncü_${target.id}`)) {
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        limit.set(`üçüncü_${target.id}`, (Number(limit.get(`üçüncü_${target.id}`) || 0)) + 1)
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Tehdit / Şantaj / İftira atmak / Kandırmak", 15, Date.now() + ms("7d"))
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: Date.now() + ms("7d")}}, {upsert: true}).exec()
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Tehdit / Şantaj / İftira atmak / Kandırmak\` sebebiyle 7 gün jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Tehdit / Şantaj / İftira atmak / Kandırmak\` sebebiyle başarılı bir şekilde cezalandırıldı (1)`);
                                                    
                                                    }
                                                    if (limit.get(`üçüncü_${target.id}`) == 1) {
                                                        // rol verme
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        // limit sistemi
                                                        limit.set(`üçüncü_${target.id}`, (Number(limit.get(`üçüncü_${target.id}`) || 0)) + 1)
                                                        setTimeout(() => {
                                                            limit.set(`üçüncü_${target.id}`, (Number(limit.get(`üçüncü_${target.id}`) || 0)) - 1)
                                                        },1000*60*120)
                                                        // ceza sistemi
                                                        limit.set(`üçüncü_${target.id}`, (Number(limit.get(`üçüncü_${target.id}`) || 0)) + 1)
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Tehdit / Şantaj / İftira atmak / Kandırmak", 15, Date.now() + ms("10d"))
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: Date.now() + ms("10d")}}, {upsert: true}).exec()
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Tehdit / Şantaj / İftira atmak / Kandırmak\` sebebiyle 10 gün jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Tehdit / Şantaj / İftira atmak / Kandırmak\` sebebiyle başarılı bir şekilde cezalandırıldı (2)`)
                                                    }
                                                    if (limit.get(`üçüncü_${target.id}`) == 2) {
                                                        // rol verme
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        // limit sistemi
                                                        limit.set(`üçüncü_${target.id}`, (Number(limit.get(`üçüncü_${target.id}`) || 0)) + 1)
                                                        setTimeout(() => {
                                                            limit.set(`üçüncü_${target.id}`, (Number(limit.get(`üçüncü_${target.id}`) || 0)) - 1)
                                                        },1000*60*180)
                                                        // ceza sistemi
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Tehdit / Şantaj / İftira atmak / Kandırmak", 15, "null")
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: null}}, {upsert: true}).exec()
                                                        // mesaj sistemi
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Tehdit / Şantaj / İftira atmak / Kandırmak\` sebebiyle sınırsız jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Tehdit / Şantaj / İftira atmak / Kandırmak\` sebebiyle başarılı bir şekilde cezalandırıldı (3)`)
                                                    }
                                                });
                                                dördüncü.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    if (!limit.get(`dördüncü_${target.id}`)) {
                                                        // rol verme
                                                        target.roles.add(muteROL)
                                                        // limit sistemi
                                                        limit.set(`dördüncü_${target.id}`, (Number(limit.get(`dördüncü_${target.id}`) || 0)) + 1)
                                                        // ceza sistemi
                                                        await cezaVer(target.id, message.author.id, "MUTE", "Uyarılara rağmen küfür ve troll", 8, Date.now() + ms("20m"))
                                                        await cezaVer(target.id, message.author.id, "SES MUTE", "Uyarılara rağmen küfür ve troll", 10, Date.now() + ms("20m"))
                                                        muteInterval.updateOne({userID: target.id}, {$set: {userID: target.id, muted: true, endDate: Date.now()+ms("20m")}}, {upsert: true}).exec()
                                                        vmuteInterval.updateOne({userID: target.id}, {$set: {userID: target.id, muted: true, endDate: Date.now()+ms("20m")}}, {upsert: true}).exec()
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Uyarılara rağmen küfür ve troll\` sebebiyle 20 dakika mute/sesmute cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Uyarılara rağmen küfür ve troll\` sebebiyle başarılı bir şekilde cezalandırıldı (1)`)
                                                    }
                                                    if (limit.get(`dördüncü_${target.id}`) == 1) {
                                                        // rol verme
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        // limit sistemi
                                                        limit.set(`dördüncü_${target.id}`, (Number(limit.get(`dördüncü_${target.id}`) || 0)) + 1)
                                                        setTimeout(() => {
                                                            limit.set(`dördüncü_${target.id}`, (Number(limit.get(`dördüncü_${target.id}`) || 0)) - 1)
                                                        },1000*60*120)
                                                        // ceza sistemi
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Uyarılara rağmen küfür ve troll", 15, Date.now() + ms("3d"))
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: Date.now()+ms("3d")}}, {upsert: true}).exec()
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Uyarılara rağmen küfür ve troll\` sebebiyle 3 gün jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Uyarılara rağmen küfür ve troll\` sebebiyle başarılı bir şekilde cezalandırıldı (2)`)
                                                    }
                                                    if (limit.get(`dördüncü_${target.id}`) == 2) {
                                                        // rol verme
                                                        target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                        // limit sistemi
                                                        limit.set(`dördüncü_${target.id}`, (Number(limit.get(`dördüncü_${target.id}`) || 0)) + 1)
                                                        setTimeout(() => {
                                                            limit.set(`dördüncü_${target.id}`, (Number(limit.get(`dördüncü_${target.id}`) || 0)) - 1)
                                                        },1000*60*180)
                                                        // ceza sistemi
                                                        await cezaVer(target.id, message.author.id, "JAIL", "Uyarılara rağmen küfür ve troll", 15, "null")
                                                        jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: null}}, {upsert: true}).exec()
                                                        // mesaj sistemi
                                                        client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Uyarılara rağmen küfür ve troll\` sebebiyle sınırsız jail cezası aldı!`)
                                                        return message.channel.send(`${target} kişisi, \`Uyarılara rağmen küfür ve troll\` sebebiyle başarılı bir şekilde cezalandırıldı (3)`)
                                                    }
                                                });
                                                beşinci.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    target.roles.set(target.roles.cache.has(boost) ? [boost, reklam] : [reklam])
                                                    await cezaVer(target.id, message.author.id, "REKLAM", "Reklam", 0, "null")
                                                    reklamInterval.updateOne({userID: target.id}, {$set: {userID: target.id, reklam: true}}, {upsert: true}).exec()
                                                    client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Reklam\` sebebiyle sınırsız reklam cezası aldı!`)
                                                    return message.channel.send(`${target} kişisi, \`Reklam\` sebebiyle başarılı bir şekilde cezalandırıldı (1)`);
                                                });
                                                altıncı.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail])
                                                    await cezaVer(target.id, message.author.id, "JAIL", "Taciz", 15, "null")
                                                    jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: null}}, {upsert: true}).exec()
                                                    client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Taciz\` sebebiyle sınırsız jail cezası aldı!`)
                                                    return message.channel.send(`${target} kişisi, \`Taciz\` sebebiyle başarılı bir şekilde cezalandırıldı (1)`);
                                                });
                                                yedinci.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    // rol verme
                                                    target.roles.add(vkcezalı)
                                                    // ceza sistemi
                                                    await cezaVer(target.id, message.author.id, "VK-CEZALI", "VK Oyun odasında Troll / Küfür", 6, Date.now() + ms("3d"))
                                                    vkInterval.updateOne({userID: target.id}, {$set: {userID: target.id, vktype: true, endDate: Date.now()+ms("3d")}}, {upsert: true}).exec()
                                                    // mesaj sistemi
                                                    client.channels.cache.get(penalLog).send(`${target} adlı kişi \`VK Oyun odasında Troll / Küfür\` sebebiyle 3 gün VK-CEZALI rolü aldı!`)
                                                    return message.channel.send(`${target} kişisi, \`VK Oyun odasında Troll / Küfür\` sebebiyle başarılı bir şekilde cezalandırıldı (3)`)
                                                });
                                                sekizinci.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    // rol verme
                                                    target.roles.add(dccezalı)
                                                    // ceza sistemi
                                                    await cezaVer(target.id, message.author.id, "DC-CEZALI", "DC Oyun odasında Troll / Küfür", 6, Date.now() + ms("3d"))
                                                    dcInterval.updateOne({userID: target.id}, {$set: {userID: target.id, dctype: true, endDate: Date.now()+ms("3d")}}, {upsert: true}).exec()
                                                    // mesaj sistemi
                                                    client.channels.cache.get(penalLog).send(`${target} adlı kişi \`DC Oyun odasında Troll / Küfür\` sebebiyle 3 gün DC-CEZALI rolü aldı!`)
                                                    return message.channel.send(`${target} kişisi, \`DC Oyun odasında Troll / Küfür\` sebebiyle başarılı bir şekilde cezalandırıldı (3)`)
                                                });
                                                dokuzuncu.on("collect", async r => {
                                                emoji.delete({timeout: 100})
                                                // rol verme
                                                target.roles.add(stcezalı)
                                                // ceza sistemi
                                                await cezaVer(target.id, message.author.id, "STREAMER-CEZALI", "Streamer odalarında Troll / Küfür", 6, Date.now() + ms("3d"))
                                                stInterval.updateOne({userID: target.id}, {$set: {userID: target.id, sttype: true, endDate: Date.now()+ms("3d")}}, {upsert: true}).exec()
                                                // mesaj sistemi
                                                client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Streamer odalarında Troll / Küfür\` sebebiyle 3 gün STREAMER-CEZALI rolü aldı!`)
                                                return message.channel.send(`${target} kişisi, \`Streamer odalarında Troll / Küfür\` sebebiyle başarılı bir şekilde cezalandırıldı (3)`)
                                                });
                                                onuncu.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    target.roles.set(target.roles.cache.has(boost) ? [boost, jail] : [jail]);
                                                    await cezaVer(target.id, message.author.id, "JAIL", "Sunucuya hakaret", 15, "null");
                                                    jailInterval.updateOne({userID: target.id}, {$set: {userID: target.id, jailed: true, endDate: null}}, {upsert: true}).exec();
                                                    client.channels.cache.get(penalLog).send(`${target} adlı kişi \`Sunucuya hakaret\` sebebiyle sınırsız jail cezası aldı!`);
                                                    return message.channel.send(`${target} kişisi, \`Sunucuya hakaret\` sebebiyle başarılı bir şekilde cezalandırıldı (1)`);
                                                });
                                                sifir.on("collect", async r => {
                                                    emoji.delete({timeout: 100})
                                                    message.channel.send(`${message.author}, sekmeyi başarılı bir şekilde kapattın.`)
                                                });
                                            }).catch(() => {})
                                        }).catch(() => {})
                                    }).catch(() => {})
                                }).catch(() => {})
                            }).catch(() => {})
                        }).catch(() => {})
                    }).catch(() => {})
                }).catch(() => {})
            }).catch(() => {})
        }).catch(() => {})
    }).catch(() => {})
})

async function cezaVer(targetID, authorID, type, reason, puan, bitis) {
    let newData = new ceza({
        ID: cezaID + 1,
        userID: targetID,
        Yetkili: authorID,
        Ceza: type,
        Sebep: reason,
        Puan: puan,
        Atilma: Date.now(),
        Bitis: bitis,
    });
    await client.savePunishment();
    await newData.save();
}
}
exports.conf = {aliases: []}
exports.help = {name: 'penal'}


