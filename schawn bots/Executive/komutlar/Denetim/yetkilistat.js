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
    let sunucuData = await sunucuayar.findOne({
        guildID: message.guild.id
    });
    if (durum || message.member.permissions.has(8) || message.member.roles.cache.get(sunucuData.EnAltYetkiliRol)) {
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let loading = await message.channel.send(`Veriler yükleniyor...`)

        let göster = await ozelKomut.find({
            guildID: message.guild.id,
            YetkiliROL: true
        })
        let arr = []
        let veri = göster.map(x => x.YetkiliData)
        veri.forEach(v => v.forEach(x => arr.push(x)));


        let statemoji = client.emojis.cache.find(x => x.name === "schawn_stat");
        let data = await Stat.findOne({
            userID: target.id,
            guildID: message.guild.id
        }) || {
            yedi: {
                Chat: {},
                Voice: {},
                TagMember: 0,
                Invite: 0,
                Register: 0,
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

        let pubPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 40 : kanallar.PublicKanallar.Puan
        let oyunPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 1 : kanallar.GameKanallar.Puan;
        let kayitPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 8 : kanallar.KayitKanallar.Puan;
        let streamPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 10 : kanallar.StreamKanallar.Puan;
        let secretPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.SecretKanallar.Puan : kanallar.SecretKanallar.Puan;
        let mesajPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 0.2 : kanallar.MesajKanallar.Puan;
        let sleepPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.SleepingKanal.Puan : kanallar.SleepingKanal.Puan;
        let alonePuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.AloneKanallar.Puan : kanallar.AloneKanallar.Puan;
        let taglıPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.TagMember : kanallar.TagMember;
        let invitePuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 10 : kanallar.Invite;
        let teyitPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 5 : kanallar.Register;
        let terapipuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 10 : kanallar.TerapiKanallar.Puan;
        let sorunçözmepuan = target.roles.cache.some(rol => [].includes(rol.id)) ? 10 : kanallar.SorunCozmeKanallar.Puan;
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
        let teyit = data.yedi.Man+data.yedi.Woman;
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

**Notlar:**
Şuanda \`${uyarı.length}\` uyarın görünmekte eğer uyarı sayın 3'ün üzerine çıkarsa aldığın her uyarı kalıcı olarak sana \`-200\` ve katı şeklinde puan ekleyecektir. (\`Ceza Puan: ${uyarı.length > 3 ? (uyarı.length-3) * (-25) : 0}\`)

**Bilgiler:**
${statemoji} Toplam Puanınız: \`${totalpoints+ekPuan+(uyarı.length > 3 ? (uyarı.length-3) * (-200) : 0)} Puan\`
${statemoji} Günlük Görev: \`${ekPuan.toFixed(0)} Puan\`
${statemoji} Ceza Puan: \`${uyarı.length > 3 ? (uyarı.length-3) * (-200) : 0}\`

**Ses Bilgileri:**
${statemoji} Public Kanallar: \`${client.convertDuration(pubOda)} (${(pubOda/(1000 * 60 * 60 * 1) * pubPuan).toFixed(0)} puan)\` (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})
${statemoji} Streamer Odaları: \`${client.convertDuration(stream)} (${(stream/(1000 * 60 * 60 * 1) * streamPuan).toFixed(0)} puan)\` (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})
${statemoji} Oyun Odaları: \`${client.convertDuration(oyunodalar)} (${(oyunodalar/(1000 * 60 * 60 * 1) * oyunPuan).toFixed(0)} puan)\` (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})
${statemoji} Private Odaları: \`${client.convertDuration(secret)} (${(secret/(1000 * 60 * 60 * 1) * secretPuan).toFixed(0)} puan)\` (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})
${statemoji} Alone Odaları: \`${client.convertDuration(alone)} (${(alone/(1000 * 60 * 60 * 1) * alonePuan).toFixed(0)} puan)\` ${kanallar.AloneKanallar.Id.length > 0 ? "" : "(**Kapalı**)"} (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})
${statemoji} Sleep Odaları: \`${client.convertDuration(sleeping)} (${(sleeping/(1000 * 60 * 60 * 1) * sleepPuan).toFixed(0)} puan)\` (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})
${statemoji} Terapi Odaları: \`${client.convertDuration(terapi)} (${(terapi/(1000 * 60 * 60 * 1) * terapipuan).toFixed(0)} puan)\` (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})
${statemoji} Sorun Çözme Odaları: \`${client.convertDuration(sçözme)} (${(sçözme/(1000 * 60 * 60 * 1) * sorunçözmepuan).toFixed(0)} puan)\` (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})
${statemoji} Kayıt Kanalları: \`${client.convertDuration(kayıt)} (${(kayıt/(1000 * 60 * 60 * 1) * kayitPuan).toFixed(0)} puan)\` (${target.roles.cache.some(rol => [].includes(rol.id)) ? "+" : "-"})

**Mesaj Bilgileri:**
${statemoji} Genel Mesaj: \`${mesaj} (${(mesaj*mesajPuan).toFixed(0)} puan)\`

**Görev Bilgileri:**
${statemoji} Yetkili Miktar: \`${yetkili} (${yetkili*yetkiliPuan} puan)\`
${statemoji} Taglı Üye: \`${taglı} (${taglı*taglıPuan} puan)\`
${statemoji} Davet: \`${invite} (${invite*invitePuan} puan)\`
${statemoji} Kayıt: \`${teyit} (${teyit*teyitPuan} puan)\`
`)
            .addField("─────────────────────", `${yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).length > 0 ? yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).map(y => `${statemoji} Yetki atlama durumunuz \`${totalpoints+ekPuan >= y.PUAN ? "Atlamaya uygun" : totalpoints+ekPuan >=( y.PUAN /2) ? "Atlamaya yakın": "Atlamaya uygun değil."}\`\n
${client.emojis.cache.find(x => x.name == "yildiz")} **Puan Durumu**
- Puanınız: \`${totalpoints+ekPuan}\` Gereken Puan: \`${y.PUAN}\`
${progressBar(totalpoints+ekPuan, y.PUAN, 8)}  \`${totalpoints+ekPuan} / ${y.PUAN}\`
${totalpoints+ekPuan >= y.PUAN ? `
${client.emojis.cache.find(x => x.name == "yildiz")} **Yetki Atlayabilirsin!**
Gerekli \`Puan\`'a ulaşarak <@&${y.ROLE_2}> yetkisine atlama hakkı kazandın!` : target.roles.cache.get(y.ROLE_1) ? `
${client.emojis.cache.find(x => x.name == "yildiz")} **Yetki Durumu**
Şuan <@&${y.ROLE_1}> rolündesiniz. <@&${y.ROLE_2}> rolüne ulaşmak için **${Number(y.PUAN-(totalpoints+ekPuan).toFixed(0))}** \`Puan\` kazanmanız gerekiyor\n─────────────────────` : ""}`) : "Üzerinde bir rol olmadığı için yükselme tablosunu gösteremiyorum."}`)


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
        };
        loading.delete();
        message.channel.send(embed);

        function yetkiliStat(data, parentArray, yasaklıArray) {
            let obje = 0;
            if (data) {
                parentArray.forEach(parentID => {
                    let ekle = 0;
                    message.guild.channels.cache.filter(channel => channel.parentID == parentID).forEach(channel => {
                        if (!yasaklıArray.includes(channel.id)) ekle += (data ? (data[channel.id] || 0) : {});
                    })
                    obje = ekle
                });
                return obje;
            } else return obje;
        };
    };

}
exports.conf = {
    aliases: ["yetkilistats", "ystat", "ystats", "Yetkilistats", "Yetkilistat"]
}
exports.help = {
    name: 'yetkilistat'
}

function progressBar(value, maxValue, size) {
    const percentage = value >= maxValue ? 100 / 100 : value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
    const progressText = `${client.emojis.cache.find(x => x.name == "schawn_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name == "schawn_griortabar")}`.repeat(emptyProgress);
    const bar = `${value ? client.emojis.cache.find(x => x.name == "schawn_solbar") : client.emojis.cache.find(x => x.name == "schawn_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "schawn_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "schawn_gribitisbar")}`}`;
    return bar;
};