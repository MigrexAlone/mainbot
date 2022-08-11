const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let stsc = require("../../models/soruncozme");
let statxp = require("../../models/stafxp.js");
let moment = require("moment");
let stringtable = require("string-table");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    if (durum) {
        let sec = args[0];
        let data = await sunucuayar.findOne({
            guildID: message.guild.id
        });
        let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({
            dynamic: true
        })).setColor("ORANGE")
        if (["Başlat", "başlat"].includes(sec)) {
            let target = message.mentions.members.map(x => x.id);
            if (target.length < 2) return message.reply("Lütfen en az 2 kişi etiketleyiniz");
            if (target.includes(message.author.id)) return;
            if (!message.member.voice && !target.some(target => target.voice)) return message.reply("Bir ses kanalında değilsiniz veya etiketlediğiniz kişi bir ses kanalında değil");
            let soruncozmeData = await stsc.findOne({
                userID: message.author.id,
                guildID: message.guild.id
            }) || {
                Type: false
            };
            if (soruncozmeData.Type == true) return message.channel.send(embed.setDescription(`\`Zaten devam etmekte bulunan bir çözülecek sorununuz bulunmakta, devamm eden sorun çözmenizi bitirmek için .sorunçözme bitir komutu ile bitirip yeni bir sorunçözme başlatabilirsin.\``))
            stsc.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                $set: {
                    Type: true,
                    userID: message.author.id,
                    guildID: message.guild.id,
                    Time: Date.now(),
                    Kisi: target
                }
            }, {
                upsert: true
            }).exec()
            message.channel.send(embed.setTitle("Sorun Çözme Başlatıldı").setDescription(`Sorun Çözücü: ${message.author} (\`${message.author.id}\`)\nSorunu Olan Üyeler: ${target.map(x => `<@${x}>`)}\nBaşlangıç: ${moment(data.Time).locale("tr").format("LLL")}\nBitiş: ${moment(Date.now()).locale("tr").format("LLL")}`))
            message.guild.channels.cache.find(c => c.name === "sorumluluk_log").send(embed.setTitle("Sorun Çözme Başlatıldı").setDescription(`Sorun Çözücü: ${message.author} (\`${message.author.id}\`)\nSorunu Olan Üyeler: ${target.map(x => `<@${x}>`)}\nBaşlangıç: ${moment(data.Time).locale("tr").format("LLL")}\nBitiş: ${moment(Date.now()).locale("tr").format("LLL")}`))
        }
        if (["durdur", "bitir", "kapat"].includes(sec)) {
            let data = await stsc.findOne({
                userID: message.author.id,
                guildID: message.guild.id
            }) || {
                Type: true
            };
            if (data.Type !== true) return message.reply(embed.setDescription("\`Aaa şey, afedersiniz ama devam eden bir çözülecek sorununuz yok, çözülecek sorunu bitirmek için önce bir çözülecek sorun başlatın.\`"))
            message.channel.send(embed.setTitle("Sorun Çözüldüi").setDescription(`Sorun Çözücü: ${message.author} (\`${message.author.id}\`)
Sorunu Çözülen Üyeler: ${data.Kisi.map(x => `<@${x}>`)}
Başlangıç: \`${moment(data.Time).locale("tr").format("LLL")}\`
Bitiş: \`${moment(Date.now()).locale("tr").format("LLL")}\`
\`\`\`Verilen sorun çözme hizmetini değerlendirmek için bu mesajın altında bulunan emojilerden birine tıklayabilirsiinz.
1. Emoji: İyi.
2. Emoji: Orta.
3. Emoji: Kötü\`\`\``))
                .then(async msg => {
                    let birEmoji = "1️⃣";
                    let ikiEmoji = "2️⃣";
                    let ucEmoji = "3️⃣";
                    msg.react(birEmoji).then(async x => {
                        msg.react(ikiEmoji).then(async x => {
                            msg.react(ucEmoji).then(async x => {
                                const bir = (reaction, user) => reaction.emoji.name === birEmoji && data.Kisi.includes(user.id);
                                const birID = msg.createReactionCollector(bir, {
                                    max: 1,
                                    time: 30000,
                                    error: ['time']
                                });
                                const iki = (reaction, user) => reaction.emoji.name === ikiEmoji && data.Kisi.includes(user.id);
                                const ikiID = msg.createReactionCollector(iki, {
                                    max: 1,
                                    time: 30000,
                                    error: ['time']
                                });
                                const uc = (reaction, user) => reaction.emoji.name === ucEmoji && data.Kisi.includes(user.id);
                                const ucID = msg.createReactionCollector(uc, {
                                    max: 1,
                                    time: 30000,
                                    error: ['time']
                                });
                                birID.on("collect", async (r, user) => {
                                    await msg.reactions.removeAll();
                                    await update(message, data, 1)
                                    await message.channel.send(`Oylama yaptığın için teşekkürler iyi eğlenceler`);
                                    await statxp.updateOne({userID: message.author.id}, {$set: {userID: message.author.id},$inc: {currentXP: 50}}, {upsert: true}).then(x => console.log(x.currentXP))
                                });
                                ikiID.on("collect", async (r, user) => {
                                    
                                    await msg.reactions.removeAll();
                                    await update(message, data, 2)
                                    await message.channel.send(`Oylama yaptığın için teşekkürler iyi eğlenceler`);
                                    await statxp.updateOne({userID: message.author.id}, {$set: {userID: message.author.id},$inc: {currentXP: 20}}, {upsert: true}).then(x => console.log(x))
                                });
                                ucID.on("collect", async (r, user) => {
                                    await msg.reactions.removeAll();
                                    await update(message, data, 3)
                                    await message.channel.send(`Oylama yaptığın için teşekkürler iyi eğlenceler`);
                                    await statxp.updateOne({userID: message.author.id}, {$set: {userID: message.author.id},$inc: {currentXP: 10}}, {upsert: true}).then(x => console.log(x))
                                })
                            })
                        })
                        msg.delete({
                            timeout: 30000
                        }).then(async x => await update(message, data, 0)).catch(() => {});
                    });
                })
            stsc.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                $set: {
                    Type: false
                }
            }).exec();
            message.guild.channels.cache.find(c => c.name === "sorumluluk_log").send(embed.setTitle("Sorun Çözüldü").setDescription(`Sorun Çözücü: ${message.author} (\`${message.author.id}\`)\nSorunu Olan Üyeler: ${data.Kisi.map(x => `<@${x}>`)}\nBaşlangıç: ${moment(data.Time).locale("tr").format("LLL")}\nBitiş: ${moment(Date.now()).locale("tr").format("LLL")}`))
        }
        if (sec == "top") {
            let data = await stsc.find({});
            let göster = data.map((user) => {
                return {
                    Id: user.userID,
                    Total: user.Katılanlar.length
                }
            }).sort((a, b) => b.Total - a.Total).map((data, index) => `${index+1}. Sorun Çözme: ${message.guild.members.cache.get(data.Id).displayName} - Kişi: ${data.Total}`).join("\n")
            message.channel.send(embed.setTitle("Sorun Çözme Listesi").setDescription(`\`\`\`${göster}\`\`\``))
        }
        if (sec == "bilgi") {
            let emoji = client.emojis.cache.find(x => x.name === "✅")
            let target = message.mentions.members.first() || message.guild.members.cache.get(sec);
            if (!target) return
            let data = await stsc.findOne({
                userID: target.id,
                guildID: message.guild.id
            });
            embed.setDescription(`
${target} adlı üyenin sorun çözme bilgileri aşağıda yer almaktadır.

**Son Çözülen Sorun**
\`\`\`
Sorun Çözücü => ${message.member.displayName}
Sorunu Olanlar => ${data.Katılanlar.reverse()[0].Id.map(data => message.guild.members.cache.get(data).displayName)}
Başlangıç => ${data.Katılanlar.reverse()[0].Baslangic}
Bitiş => ${data.Katılanlar.reverse()[0].Bitis}
Memnuniyet => ${data.Katılanlar.reverse()[0].Memnuniyet == 1 ? "Çok İyi" : data.Katılanlar.reverse()[0].Memnuniyet == 2 ? "İyi" : data.Katılanlar.reverse()[0].Memnuniyet == 3 ? "Kötü" : "Oy Verilmedi"}
\`\`\`

**Daha fazlası için ${emoji} tepkisine tıklayınız**
`)
            message.channel.send(embed).then(msg => {
                let table = stringtable.create(data.Katılanlar.map(x => Object.assign({
                    "Sorun Çözücü": message.member.displayName,
                    "Sorunu Olanlar": `${x.Id.map(x => message.guild.members.cache.get(x).user.username)}`,
                    "Başlangıç": x.Baslangic,
                    "Bitiş": x.Bitis,
                    "Memnuniyet": x.Memnuniyet == 1 ? "Çok İyi" : x.Memnuniyet == 2 ? "İyi" : x.Memnuniyet == 3 ? "Kötü" : "Oy Verilmedi"
                })))
                msg.react(emoji);
                const indir = (reaction, user) => reaction.emoji.name === emoji.name && user.id === message.author.id;
                const indirID = msg.createReactionCollector(indir, {
                    time: 60000
                });
                indirID.on("collect", async r => {
                    await msg.reactions.removeAll();
                    await message.channel.send(table, {
                        code: "md",
                        split: true
                    });
                });
            })
        }
        if (sec == "yardım" || !sec) {
            let embed = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({
                    dynamic: true
                }))
                .setFooter(client.ayarlar.footer)
                .setTimestamp().setColor("RANDOM")
                .setTitle("Sorun Çözme Sistemi Nasıl Çalışır?")
                .setDescription(`
Bu sistemin çalışma mantığı çok anlaşılır ve basit bir şekilde kodlanmıştır.
Öncelikle soruncozme yapmak istediğiniz kişi ile aynı odaya giriyorsunuz ve ardından aşağıdaki adımları takip ediniz.

**Komutlar:**
\`\`\`
${client.ayarlar.prefix[0]}sorunçözme başlat @etiket
${client.ayarlar.prefix[0]}sorunçözme bitir
${client.ayarlar.prefix[0]}sorunçözme bilgi @etiket
${client.ayarlar.prefix[0]}sorunçözme top
\`\`\`

şeklinde kullanım sağlayarak sorunçözme komutunu sorunsuz bir şekilde çalıştırabilirsiniz.
`)
            message.channel.send(embed)
        }
    }

}
exports.conf = {
    aliases: []
};
exports.help = {
    name: 'soruncozme'
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