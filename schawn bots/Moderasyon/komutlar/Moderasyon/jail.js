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
let jailInterval = require("../../models/jailInterval");
var limit = new Map(); 
const banReasons = [
    "Troll",
    "Fake Cam / Bass açmak / Soundpad",
    "Ailevi Küfür / Taciz",
    "Sunucuyu Kötüleme",
    "Dini değerler ile dalga geçme / Topluma veya Irk'a Yönelik Hakaret",
    "Başkalarını rahatsız edecek, kara mizah dark meme ve +18 görseller paylaşmak/yayınlamak"
  ];

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let jailSorumlusu = data.JAILAuthorized;
    let jailLogKanal = data.JAILChannel;
    let jailLimit = data.JAILLimit;
    let cezaID = data.WARNID;
    let jailROL = data.JAIL;
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
        if (jailSorumlusu.length >= 1 && client.channels.cache.get(jailLogKanal) && jailLimit >= 1) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return client.Embed(message.channel.id, `Lütfen bir kişi belirtiniz`);
            if (target.roles.cache.get(jailROL)) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
            if (limit.get(message.author.id) >= jailLimit) return message.reply(`\`jail komutu için limite ulaştın!\``);
            if (target.roles.cache.get(data.EnAltYetkiliRol) && !message.member.roles.cache.some(rol => data.UstYetkiliRol.includes(rol.id))) return message.reply("Yetkililer birbirine ceza-i işlem uygulayamazlar.");
            if (message.member.roles.highest.position <= target.roles.highest.position) return client.Embed(message.channel.id, `Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)
            if (target.id === message.author.id) return;
            limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
            setTimeout(() => {
                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
            },1000*60*3)
            await banSistemi(message, client, jailLogKanal, target, cezaID, jailROL, booster);
            let cezalar = await ceza.find({userID: target.id});
            if (cezalar.length == 0) {
                cezalar = [{Puan: 0}, {Puan: 0}];
            };
            await client.toplama(cezalar,client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 15);
        } else return client.Embed(message.channel.id, "Lütfen jail komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "jail setup` yazarak kurunuz!")
    } else return;
}
exports.conf = {
    aliases: ["cezalı", "Jail", "Cezalı", "JAIL", "JAİL", "CEZALI"]
}
exports.help = {
    name: 'jail'
}
async function banSistemi(message, client, jailLogKanal, target, cezaID, jailROL, booster) {

    let msg = await message.channel.send(new MessageEmbed()
.setDescription(`${target} adlı kullanıcıyı hangi sebepten dolayı jail'e göndermek istiyorsunuz;

${banReasons.map((r, i) => `**${i+1}.** ${r}`).join("\n")}

_Lütfen jail sebebi numarasını 30 saniye içerisinde sohbete giriniz._`))

    message.channel.awaitMessages(m => m.author.id === message.author.id && Number(m.content) && (Number(m.content) > 0 && Number(m.content) <= banReasons.length), { max: 1, time: 30000, errors: ['time'] })
    .then(async collected => { 
        await msg.delete();
        let reason = banReasons[Number(collected.first().content)-1];

        let messageEmbed = `${target} Üyesi Sunucudan **${reason}** sebebiyle ${message.author} Tarafından jail cezası yedi! **Ceza Numarası:** (\`#${cezaID+1}\`)`;
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
• Ceza Bitiş Tarihi: \`Kalıcı\`
• Ceza Sebebi: [\`${reason}\`]
`);
        await target.roles.set(target.roles.cache.get(booster) ? [jailROL, booster] : [jailROL]).then(async () => {
            await message.channel.send(messageEmbed);
            await client.channels.cache.get(jailLogKanal).send(messageLogEmbed);
			if (target.voice.channel) {
				target.voice.setChannel(null);
			}
                let newData = ceza({
                    ID: cezaID + 1,
                    userID: target.id,
                    Yetkili: message.author.id,
                    Ceza: "JAIL",
                    Sebep: reason,
                    Puan: 15,
                    Atilma: Date.now(),
                    Bitis: "KALICI",
                });
                await profil.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {JailAmount: 1}}, {upsert: true}).exec();
                await client.savePunishment();
                await newData.save();

                await jailInterval.findOne({userID: target.id}, (err,data) => {
                    if (!data) {
                        newData = new jailInterval({
                            userID: target.id,
                            jailed: true,
                        })
                        newData.save()
                    } else {
                        data.jailed = true,data.save();
                    }
                })
        });
    });
};