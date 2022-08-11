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
let profil = require("../../models/profil");
var limit = new Map();
const banReasons = [
    "Allah'a, Atatürk'e, Dine ve Şehitlere Küfür",
    "Birden fazla Mute ve jail yemiş sunucuda sorun çıkartmak",
    "Şahsa ait kişisel bilgileri sunucu içinde ifşalamak, paylaşmak, sunucu üyelerine göndermek"
  ];
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let banSorumlusu = data.BANAuthorized
    let banLogKanal = data.BANChannel
    let banLimit = data.BANLimit
    let cezaID = data.WARNID;

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
                    return data.BANAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.BANChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "schawn_iptal"));
                    return data.BANLimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "schawn_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    }
    if (await client.permAyar(message.author.id, message.guild.id, "ban") || durum) {
        if (banSorumlusu.length >= 1 && client.channels.cache.get(banLogKanal) && banLimit >= 1) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply("Lütfen bir kişi ve sebep belirtiniz");
            if (limit.get(message.author.id) >= banLimit) return message.reply(`\`ban komutu için limite ulaştın!\``);
            if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`);
            if (target.id === message.author.id) return message.reply("Kendini banlayamazsın!");



limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
setTimeout(() => {
    limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
},1000*60*3)
        await banSistemi(message, client, banLogKanal, target, cezaID);
        } else return message.reply("Lütfen ban komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "ban setup` yazarak kurunuz!")
    } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici - Ban Sorumlusu olmalısın!`)
}
exports.conf = {
    aliases: ["Ban"]
}
exports.help = {
    name: 'ban'
}
async function banSistemi(message, client, banLogKanal, target, cezaID) {

let msg = await message.channel.send(new MessageEmbed()
.setDescription(`${target} adlı kullanıcıyı hangi sebepten dolayı banlamak istiyorsunuz;

${banReasons.map((r, i) => `**${i+1}.** ${r}`).join("\n")}

_Lütfen ban sebebi numarasını 30 saniye içerisinde sohbete giriniz._`))

message.channel.awaitMessages(m => m.author.id === message.author.id && Number(m.content) && (Number(m.content) > 0 && Number(m.content) <= banReasons.length), { max: 1, time: 30000, errors: ['time'] })
.then(async collected => {
    await msg.delete();
    let reason = banReasons[Number(collected.first().content)-1];
    let messageEmbed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.author.tag, message.author.avatarURL({
        dynamic: true
    }))
    .setFooter(conf.footer)
    .setTimestamp()
    .setImage("https://cdn.discordapp.com/attachments/751526628340793427/781384793207472158/bangif4.gif")
    .setDescription(`**${target} Üyesi Sunucudan ${reason} Sebebiyle \n${message.author} Tarafından banlandı! Ceza Numarası:** (\`#${cezaID+1}\`)`)

let messageLogEmbed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.author.tag, message.author.avatarURL({
        dynamic: true
    }))
    .setFooter(conf.footer)
    .setTimestamp()
    .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Yasaklanan Üye: ${target} (\`${target.id}\`)
• Yasaklayan Yetkili: ${message.author} (\`${message.author.id}\`)
• Yasaklanma Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Yasaklanma Sebebi: [\`${reason}\`]
`)
    await message.guild.members.ban(target.id, { reason: `${reason} | Yetkili: ${message.author.tag}` })
    await message.channel.send(messageEmbed);
    await client.channels.cache.get(banLogKanal).send(messageLogEmbed);
    await target.user.send(`${message.guild.name} adlı sunucumuzdan ${reason} sebebi ile uzaklaştırıldın`)
    let newData = ceza({
        ID: cezaID + 1,
        userID: target.id,
        Yetkili: message.author.id,
        Ceza: "BAN",
        Sebep: reason,
        Puan: 30,
        Atilma: Date.now(),
        Bitis: "KALICI",
    });
    await profil.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {BanAmount: 1}}, {upsert: true}).exec();
    await client.savePunishment();
    await newData.save();
}).catch(collected => msg.delete());
}