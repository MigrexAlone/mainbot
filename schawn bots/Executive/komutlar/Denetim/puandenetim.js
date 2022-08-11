const {
    MessageEmbed
} = require("discord.js");
require("moment-timezone")
let Stat = require("../../models/stats");
let sunucuayar = require("../../models/sunucuayar");
let xpData = require("../../models/stafxp");
let uyarıData = require("../../models/uyarı");
let puansystem = require("../../models/puansystem");
let taglıData = require("../../models/taglıUye");
let ozelKomut = require("../../models/özelkomut");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

    if (!message.member.permissions.has(8) && !durum) return;
    if (!args[0]) {
        return embed(message, client);
    };
    let role = message.guild.roles.cache.get(args[1]) || message.mentions.roles.first();
    let statemoji = client.emojis.cache.find(x => x.name === "schawn_stat");
    if (role) {
        await role.members.map(async target => {
            let göster = await ozelKomut.find({
                guildID: message.guild.id,
                YetkiliROL: true
            })
            let arr = []
            let veri = göster.map(x => x.YetkiliData)
            veri.forEach(v => v.forEach(x => arr.push(x)));
            let data = await Stat.findOne({
                userID: target.id,
                guildID: message.guild.id
            }) || {
                yedi: {
                    Chat: {},
                    Voice: {},
                    TagMember: 0,
                    Invite: 0,
                    Man: 0,
                    Woman: 0,
                    Yetkili: 0
                }
            };
            let data2 = await taglıData.find({
                authorID: target.id,
                Durum: "puan"
            }) || [];
            let kanallar = await puansystem.findOne({
                guildID: message.guild.id
            });
            let uyarı = await uyarıData.find({
                userID: target.id
            }) || [];
            let yetkiler = kanallar.PuanRolSystem;
            let puan = await xpData.findOne({
                userID: target.id
            }) || {
                currentXP: 0
            };
            let ekPuan = puan.currentXP;


            let pubPuan = kanallar.PublicKanallar.Puan
            let oyunPuan = kanallar.GameKanallar.Puan;
            let kayitPuan = kanallar.KayitKanallar.Puan;
            let streamPuan = kanallar.StreamKanallar.Puan;
            let secretPuan = kanallar.SecretKanallar.Puan;
            let mesajPuan = kanallar.MesajKanallar.Puan;
            let sleepPuan = kanallar.SleepingKanal.Puan;
            let alonePuan = kanallar.AloneKanallar.Puan;
            let taglıPuan = kanallar.TagMember;
            let invitePuan = kanallar.Invite;
            let teyitPuan = kanallar.Register;
            let terapipuan = kanallar.TerapiKanallar.Puan;
            let sorunçözmepuan = kanallar.SorunCozmeKanallar.Puan;
            let yetkiliPuan = 25;


            let pubOda = yetkiliStat(data.yedi.Voice, kanallar.PublicKanallar.Id, kanallar.SleepingKanal.Id);
            let oyunodalar = yetkiliStat(data.yedi.Voice, kanallar.GameKanallar.Id, []);
            let kayıt = yetkiliStat(data.yedi.Voice, kanallar.KayitKanallar.Id, []);
            let stream = yetkiliStat(data.yedi.Voice, kanallar.StreamKanallar.Id, []);
            let secret = yetkiliStat(data.yedi.Voice, kanallar.SecretKanallar.Id, []);
            let mesaj = data.yedi.Chat ? yetkiliStat(data.yedi.Chat, kanallar.MesajKanallar.Id, []) : 0;
            let sleeping;
            if (!data.yedi.Voice) sleeping = 0;
            else sleeping = data.yedi.Voice[kanallar.SleepingKanal.Id] || 0;
            let alone = yetkiliStat(data.yedi.Voice, kanallar.AloneKanallar.Id, []);
            let terapi = yetkiliStat(data.yedi.Voice, kanallar.TerapiKanallar.Id, []);
            let sçözme = yetkiliStat(data.yedi.Voice, kanallar.SorunCozmeKanallar.Id, []);
            let yetkili = arr.filter(x => x.Author == target.id).length;
            let taglı = data2.length;
            let invite = data.yedi.Invite;
            let teyit = data.yedi.Man + data.yedi.Woman;
            let totalpoints = Number((pubOda / (1000 * 60 * 60 * 1) * pubPuan).toFixed(0)) +
                Number((stream / (1000 * 60 * 60 * 1) * streamPuan).toFixed(0)) +
                Number((oyunodalar / (1000 * 60 * 60 * 1) * oyunPuan).toFixed(0)) +
                Number((secret / (1000 * 60 * 60 * 1) * secretPuan).toFixed(0)) +
                (kanallar.AloneKanallar.Id.length > 0 ? Number((alone / (1000 * 60 * 60 * 1) * alonePuan).toFixed(0)) : 0) +
                Number((sleeping / (1000 * 60 * 60 * 1) * sleepPuan).toFixed(0)) +
                Number((terapi / (1000 * 60 * 60 * 1) * terapipuan).toFixed(0)) +
                Number((sçözme / (1000 * 60 * 60 * 1) * sorunçözmepuan).toFixed(0)) +
                Number((kayıt / (1000 * 60 * 60 * 1) * kayitPuan).toFixed(0)) + Number((mesaj * mesajPuan).toFixed(0)) + Number((yetkili * yetkiliPuan)) + Number((taglı * taglıPuan)) + Number((invite * invitePuan)) + Number((teyit * teyitPuan));



            let embed = new MessageEmbed().setColor("RANDOM").setAuthor(target.displayName, target.user.avatarURL({
                    dynamic: true
                })).setFooter(client.ayarlar.footer)
                .setDescription(`
${target} kullanıcısının yetki yükseltim bilgileri aşağıda belirtilmiştir.
**Bilgiler:**
${statemoji} Toplam Puanınız: \`${totalpoints} (Ek: ${ekPuan.toFixed(0)} => Ceza: ${uyarı.length > 3 ? (uyarı.length-3) * (-200) : 0} => ${totalpoints+ekPuan+(uyarı.length > 3 ? (uyarı.length-3) * (-200) : 0)})\`

**Ses Bilgileri:**
${statemoji} Public Kanallar: \`${client.convertDuration(pubOda)} (${(pubOda/(1000 * 60 * 60 * 1) * pubPuan).toFixed(0)} puan)\`
${statemoji} Streamer Odaları: \`${client.convertDuration(stream)} (${(stream/(1000 * 60 * 60 * 1) * streamPuan).toFixed(0)} puan)\`
${statemoji} Oyun Odaları: \`${client.convertDuration(oyunodalar)} (${(oyunodalar/(1000 * 60 * 60 * 1) * oyunPuan).toFixed(0)} puan)\`
${statemoji} Private Odaları: \`${client.convertDuration(secret)} (${(secret/(1000 * 60 * 60 * 1) * secretPuan).toFixed(0)} puan)\`
${statemoji} Alone Odaları: \`${client.convertDuration(alone)} (${(alone/(1000 * 60 * 60 * 1) * alonePuan).toFixed(0)} puan)\` ${kanallar.AloneKanallar.Id.length > 0 ? "" : "(**Kapalı**)"}
${statemoji} Sleep Odaları: \`${client.convertDuration(sleeping)} (${(sleeping/(1000 * 60 * 60 * 1) * sleepPuan).toFixed(0)} puan)\`
${statemoji} Terapi Odaları: \`${client.convertDuration(terapi)} (${(terapi/(1000 * 60 * 60 * 1) * terapipuan).toFixed(0)} puan)\`
${statemoji} Sorun Çözme Odaları: \`${client.convertDuration(sçözme)} (${(sçözme/(1000 * 60 * 60 * 1) * sorunçözmepuan).toFixed(0)} puan)\`
${statemoji} Kayıt Kanalları: \`${client.convertDuration(kayıt)} (${(kayıt/(1000 * 60 * 60 * 1) * kayitPuan).toFixed(0)} puan)\`

**Mesaj Bilgileri:**
${statemoji} Genel Mesaj: \`${mesaj} (${(mesaj*mesajPuan).toFixed(0)} puan)\`

**Görev Bilgileri:**
${statemoji} Yetkili Miktar: \`${yetkili} (${yetkili*yetkiliPuan} puan)\`
${statemoji} Taglı Üye: \`${taglı} (${taglı*taglıPuan} puan)\`
${statemoji} Davet: \`${invite} (${invite*invitePuan} puan)\`
${statemoji} Kayıt: \`${teyit} (${teyit*teyitPuan} puan)\`
`)

            if (kanallar.AutoRankUP.Type == true) {
                for (var i = 0; i < yetkiler.length; i++) {
                    if (yetkiler[i].ROLE_1 === kanallar.AutoRankUP.sabitROL) break;
                };
                yetkiler.slice(0, i).filter(user => target.roles.cache.get(user.ROLE_1)).map(async user => {
                    if (totalpoints + ekPuan >= user.PUAN) {
                        target.roles.remove(user.ROLE_1)
                        target.roles.add(user.ROLE_2)
                        client.channels.cache.get(kanallar.AutoRankUP.LogChannel).send(`:tada: ${target} tebrikler! Gerekli XP'ye ulaşarak **${message.guild.roles.cache.get(user.ROLE_1).name}** rolünden **${message.guild.roles.cache.get(user.ROLE_2).name}** rolüne atladın!`)
                        await Stat.updateOne({
                            userID: target.id,
                            guildID: message.guild.id
                        }, {
                            $set: {
                                ["yedi.Id"]: target.id,
                                ["yedi.Voice"]: {},
                                ["yedi.Chat"]: {},
                                ["yedi.TagMember"]: 0,
                                ["yedi.Invite"]: 0,
                                ["yedi.Woman"]: 0,
                                ["yedi.Man"]: 0,
                                ["yedi.Yetkili"]: 0,
                            }
                        }).exec();
                        await xpData.updateOne({
                            userID: target.id
                        }, {
                            $set: {
                                currentXP: 0
                            }
                        }, {
                            upsert: true
                        }).exec();
                        await ozelKomut.updateMany({
                            guildID: message.guild.id,
                            komutAd: {
                                $exists: true
                            }
                        }, {
                            $pull: {
                                YetkiliData: {
                                    Author: target.id
                                }
                            }
                        }).exec();
                        await taglıData.deleteMany({
                            Durum: "puan",
                            authorID: target.id
                        }).exec()
                    };
                });
            }
            message.channel.send(embed);
        })
    } else return

    function yetkiliStat(data, parentArray, yasaklıArray) {
        let obje = 0;
        if (data) {
            parentArray.forEach(parentID => {
                let ekle = 0;
                message.guild.channels.cache.filter(channel => channel.parentID == parentID).forEach(channel => {
                    if (!yasaklıArray.includes(channel.id)) ekle += (data ? (data[channel.id] || 0) : {});
                })
                obje = ekle
            })
            return obje
        } else return obje
    }
}
exports.conf = {
    aliases: ["denetim", "denetle", "denetleme", "Denetle"]
}
exports.help = {
    name: 'Denetim'
}

function progressBar(value, maxValue, size) {
    const percentage = value >= maxValue ? 100 / 100 : value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
    const progressText = `${client.emojis.cache.find(x => x.name === "schawn_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name === "schawn_griortabar")}`.repeat(emptyProgress);
    const bar = `${value ? client.emojis.cache.find(x => x.name === "schawn_solbar") : client.emojis.cache.find(x => x.name === "schawn_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "schawn_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "schawn_gribitisbar")}`}`;
    return bar;
};