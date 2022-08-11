const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let stsc = require("../../models/terapi");
let statxp = require("../../models/stafxp");
let moment = require("moment");
let stringtable = require("string-table");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    let sec = args[0];
    let data = await sunucuayar.findOne({
        guildID: message.guild.id
    });
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({
        dynamic: true
    })).setColor("PINK")
    if (["Başlat", "başlat"].includes(sec)) {
        let target = message.mentions.members.first() || message.guild.members.cache.get(sec);
        if (!target) return message.reply("Bir kişi etiketleyiniz");
        if(target.id == message.author.id) return;
        if (!message.member.voice && !target.voice) return message.reply("Bir ses kanalında değilsiniz veya etiketlediğiniz kişi bir ses kanalında değil"); 
        if (target.voice.channelID !== message.member.voice.channel.id) return message.reply("Etiketlediğiniz kişi ile aynı ses kanalında değilsiniz.")
        let terapiData = await stsc.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        }) || {
            Type: false
        };
        if (terapiData.Type == true) return message.channel.send(embed.setDescription(`\`Zaten devam etmekte bulunan bir terapin bulunmakta, devamm eden terapini .terapi bitir komutu ile bitirip yeni bir terapi başlatabilirsin.\``))
        stsc.updateOne({
            userID: message.author.id,
            guildID: message.guild.id
        }, {
            $set: {
                Type: true,
                userID: message.author.id,
                guildID: message.guild.id,
                Time: Date.now(),
                Kisi: target.id
            }
        }, {
            upsert: true
        }).exec()
        message.channel.send(embed.setTitle("Terapi Başlatıldı").setDescription(`Terapist: ${message.author} (\`${message.author.id}\`)\nHasta: ${target}(\`${target.id}\`)\nTarih: ${moment(Date.now()).locale("tr").format("LLL")}\n`))
    }
    if (["durdur", "bitir", "kapat"].includes(sec)) {
        let data = await stsc.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        }) || {
            Type: true
        };
        if (data.Type !== true) return message.reply(embed.setDescription("\`Aaa şey, afedersiniz ama devam eden bir terapiniz yok, terapi bitirmek için önce bir terapi başlatmanız gerek.\`"))
        message.channel.send(embed.setTitle("Terapi Bitirildi").setDescription(`Terapist: ${message.author} (\`${message.author.id}\`)
Hasta: <@${data.Kisi}> (\`${data.Kisi}\`)
Başlangıç: \`${moment(data.Time).locale("tr").format("LLL")}\`
Bitiş: \`${moment(Date.now()).locale("tr").format("LLL")}\`
\`\`\`Verilen terapiyi değerlendirmek için bu mesajın altında bulunan emojilerden birine tıklayabilirsiinz.
1. Emoji: İyi
2. Emoji: Orta
3. Emoji: Kötü\`\`\``))
            .then(async msg => {
                let birEmoji = "1️⃣";
                let ikiEmoji = "2️⃣";
                let ucEmoji = "3️⃣";
                msg.react(birEmoji).then(async x => {
                    msg.react(ikiEmoji).then(async x => {
                        msg.react(ucEmoji).then(async x => {
                            const bir = (reaction, user) => reaction.emoji.name === birEmoji && user.id === data.Kisi;
                            const birID = msg.createReactionCollector(bir, {
                                max: 1,
                                time: 30000,
                                error: ['time']
                            });
                            const iki = (reaction, user) => reaction.emoji.name === ikiEmoji && user.id === data.Kisi;
                            const ikiID = msg.createReactionCollector(iki, {
                                max: 1,
                                time: 30000,
                                error: ['time']
                            });
                            const uc = (reaction, user) => reaction.emoji.name === ucEmoji && user.id === data.Kisi;
                            const ucID = msg.createReactionCollector(uc, {
                                max: 1,
                                time: 30000,
                                error: ['time']
                            });
                            birID.on("collect", async r => {
                                console.log(r)
                                await msg.reactions.removeAll();
                                await update(message, data, 1)
                                await message.channel.send(`Oylama yaptığın için teşekkürler iyi eğlenceler`);
                                await statxp.updateOne({userID: message.author.id}, {$inc: {currentXP: 50}}, {upsert: true}).exec()
                            });
                            ikiID.on("collect", async r => {
                                await msg.reactions.removeAll();
                                await update(message, data, 2)
                                await message.channel.send(`Oylama yaptığın için teşekkürler iyi eğlenceler`);
                                await statxp.updateOne({userID: message.author.id}, {$inc: {currentXP: 20}}, {upsert: true}).exec()
                            });
                            ucID.on("collect", async r => {
                                await msg.reactions.removeAll();
                                await update(message, data, 3)
                                await message.channel.send(`Oylama yaptığın için teşekkürler iyi eğlenceler`);
                                await statxp.updateOne({userID: message.author.id}, {$inc: {currentXP: 10}}, {upsert: true}).exec()
                            })
                        })
                    })
                    msg.delete({timeout: 30000}).then(async x => await update(message,data,0)).catch(() => {});
                });
            })
        stsc.updateOne({userID: message.author.id, guildID: message.guild.id}, {$set: {Type: false}}).exec();
        message.guild.channels.cache.find(c => c.name === "sorumluluk_log").send(embed.setTitle("TERAPİ BİTİRİLDİ").setDescription(`Terapist: ${message.author} (\`${message.author.id}\`)\nHasta: <@${data.Kisi}> (\`${data.Kisi}\`)\nBaşlangıç: ${moment(data.Time).locale("tr").format("LLL")}\nBitiş: ${moment(Date.now()).locale("tr").format("LLL")}`))
    }
    if (sec == "top") {
        let data = await stsc.find({});
        let göster = data.map((user) => {
            return {
                Id: user.userID,
                Total: user.Katılanlar.length
            }
        }).sort((a, b) => b.Total - a.Total).map((data, index) => `${index+1}. Terapist: ${message.guild.members.cache.get(data.Id).displayName} - Kişi: ${data.Total}`).join("\n")
        message.channel.send(embed.setTitle("Terapi Listesi").setDescription(`\`\`\`${göster}\`\`\``))
    }
    if (sec == "bilgi") {
        let emoji = client.emojis.cache.find(x => x.name === "✅")
        let target = message.mentions.members.first() || message.guild.members.cache.get(sec);biliy
        if (!target) return
        let data = await stsc.findOne({
            userID: target.id,
            guildID: message.guild.id
        });
        embed.setDescription(`
${target} adlı üyenin terapi bilgileri aşağıda yer almaktadır.

**Son Yapılan Terapisi**
\`\`\`
Terapist => ${message.member.displayName}
Hasta => ${message.guild.members.cache.get(data.Katılanlar.reverse()[0].Id).displayName}
Başlangıç => ${data.Katılanlar.reverse()[0].Baslangic}
Bitiş => ${data.Katılanlar.reverse()[0].Bitis}
Memnuniyet => ${data.Katılanlar.reverse()[0].Memnuniyet == 1 ? "Çok İyi" : data.Katılanlar.reverse()[0].Memnuniyet == 2 ? "İyi" : data.Katılanlar.reverse()[0].Memnuniyet == 3 ? "Kötü" : "Oy Verilmedi"}
\`\`\`

**Daha fazlası için ${emoji}  tepkisine tıklayınız**
`)
        message.channel.send(embed).then(x => {
            let table = stringtable.create(data.Katılanlar.map(x => Object.assign({
                Terapist: message.member.displayName,
                Hasta: message.guild.members.cache.get(x.Id).displayName,
                "Başlangıç": x.Baslangic,
                "Bitiş": x.Bitis,
                "Memnuniyet": x.Memnuniyet == 1 ? "Çok İyi" : x.Memnuniyet == 2 ? "İyi" : x.Memnuniyet == 3 ? "Kötü" : "Oy Verilmedi"
            })))
            x.react(emoji);
            const indir = (reaction, user) => reaction.emoji.name === emoji.name && user.id === message.author.id;
            const indirID = x.createReactionCollector(indir, {
                time: 60000
            });
            indirID.on("collect", async r => {
                await x.reactions.removeAll();
                await message.channel.send(table, {
                    code: "md",
                    split: true
                });
            });
        })
    }
    if (sec == "yardım" || !sec) {
    let embed = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
    .setFooter(client.ayarlar.footer)
    .setTimestamp()
    .setDescription(`
**Terapi sistemi nasıl çalışır?**
Bu sistemin çalışma mantığı çok anlaşılır ve basit bir şekilde kodlanmıştır.
Öncelikle terapi yapmak istediğiniz kişi ile aynı odaya giriyorsunuz ve ardından aşağıdaki adımları takip ediniz.

**Komutlar:**
\`\`\`
${client.ayarlar.prefix[0]}terapi başlat @etiket
${client.ayarlar.prefix[0]}terapi bitir
${client.ayarlar.prefix[0]}terapi bilgi @etiket
${client.ayarlar.prefix[0]}terapi top
\`\`\`

şeklinde kullanım sağlayarak terapi komutunu sorunsuz bir şekilde çalıştırabilirsiniz.
    `)
    message.channel.send(embed)
    }
}
exports.conf = {
    aliases: []
};
exports.help = {
    name: 'terapi'
};

async function update(message, data, miktar) {
    stsc.updateOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, {
        $set: {
            Type: false
        },
        $push: {
            Katılanlar: {
                "Id": data.Kisi,
                "Memnuniyet": miktar,
                "Baslangic": moment(data.Time).locale("tr").format("LLL"),
                "Bitis": moment(Date.now()).locale("tr").format("LLL"),
            }
        }
    }, {
        upsert: true
    }).exec()
}