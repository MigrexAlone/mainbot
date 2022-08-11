const {
    MessageEmbed
} = require("discord.js");
const Stat = require("../../models/stats");
let tablo = require("string-table");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    

    return message.reply("Bu kod yapım aşamasındadır.")
    let data = await Stat.findOne({
        userID: message.author.id,
        guildID: message.guild.id
    })

    let magazasahibi = ""

    let market = [{
            "ÜRÜN": "Youtube Premium",
            "FİYAT": `1200 💵`,
            "MİKTAR": 1 + " adet",
            "SATIN AL": `${client.ayarlar.prefix[0]}cs youtube`
        },
        {
            "ÜRÜN": "Spotify",
            "FİYAT": `1850 💵`,
            "MİKTAR": 1 + " adet",
            "SATIN AL": `${client.ayarlar.prefix[0]}cs spoti`
        },
        {
            "ÜRÜN": "Steam Key",
            "FİYAT": `3000 💵`,
            "MİKTAR": 1 + " adet",
            "SATIN AL": `${client.ayarlar.prefix[0]}cs steam`
        },
        {
            "ÜRÜN": "Netflix",
            "FİYAT": `2200 💵`,
            "MİKTAR": 1 + " adet",
            "SATIN AL": `${client.ayarlar.prefix[0]}cs netflix`
        },
        {
            "ÜRÜN": "Nitro",
            "FİYAT": `12850 💵`,
            "MİKTAR": 1 + " adet",
            "SATIN AL": `${client.ayarlar.prefix[0]}cs nitro`
        },
        {
            "ÜRÜN": "Nitro Boost",
            "FİYAT": `26000 💵`,
            "MİKTAR": 1 + " adet",
            "SATIN AL": `${client.ayarlar.prefix[0]}cs nitrob`
        }
    ]

    let sec = args[0];

    if (sec == "youtube") {
        if (data.coin.toFixed(0) >= 1200) {
            Stat.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                coin: ata.coin.toFixed(0) - 1200
            })
            message.guild.members.cache.get(magazasahibi).user.send(`${message.author} adlı üye youtube paketi satın aldı lütfen ürününü teslim ediniz.`)
            return message.reply(`Başarılı bir şekilde youtube premium paketi satın aldınız lütfen <@${magazasahibi}> ile iletişime geçiniz.`)
        };
    } else
    if (sec == "spotify") {
        if (data.coin.toFixed(0) >= 1850) {
            Stat.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                coin: data.coin.toFixed(0) - 1850
            })
            message.guild.members.cache.get(magazasahibi).user.send(`${message.author} adlı üye spotify paketi satın aldı lütfen ürününü teslim ediniz.`)
            return message.reply(`Başarılı bir şekilde spotify premium paketi satın aldınız lütfen <@${magazasahibi}> ile iletişime geçiniz.`)
        } else return;
    } else if (sec == "steam") {
        if (data.coin.toFixed(0) >= 3000) {
            Stat.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                coin: data.coin.toFixed(0) - 3000
            })
            message.guild.members.cache.get(magazasahibi).user.send(`${message.author} adlı üye steam key paketi satın aldı lütfen ürününü teslim ediniz.`)
            return message.reply(`Başarılı bir şekilde steam premium paketi satın aldınız lütfen <@${magazasahibi}> ile iletişime geçiniz.`)
        };
    } else if (sec == "netflix") {
        if (data.coin.toFixed(0) >= 2200) {
            Stat.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                coin: data.coin.toFixed(0) - 2200
            })
            message.guild.members.cache.get(magazasahibi).user.send(`${message.author} adlı üye netflix paketi satın aldı lütfen ürününü teslim ediniz.`)
            return message.reply(`Başarılı bir şekilde netflix premium paketi satın aldınız lütfen <@${magazasahibi}> ile iletişime geçiniz.`)
        };
    } else if (sec == "nitro") {
        if (data.coin.toFixed(0) >= 12850) {
            Stat.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                coin: data.coin.toFixed(0) - 12850
            })
            message.guild.members.cache.get(magazasahibi).user.send(`${message.author} adlı üye nitro paketi satın aldı lütfen ürününü teslim ediniz.`)
            return message.reply(`Başarılı bir şekilde nitro premium paketi satın aldınız lütfen <@${magazasahibi}> ile iletişime geçiniz.`)
        };
    } else if (sec == "nitrob") {
        if (data.coin.toFixed(0) >= 26000) {
            Stat.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                coin: data.coin.toFixed(0) - 26000
            })
            message.guild.members.cache.get(magazasahibi).user.send(`${message.author} adlı üye nitro boost paketi satın aldı lütfen ürününü teslim ediniz.`)
            return message.reply(`Başarılı bir şekilde nitro boost premium paketi satın aldınız lütfen <@${magazasahibi}> ile iletişime geçiniz.`)
        };
    } else {
        let mesaj = tablo.create(market)

        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`💵 **Owa Coin** mağazasına hoş geldin ${message.author},

Burada kendine çeşitli eşyalar ve sunucumuz için işine yarayabilecek belirli özelliklerden satın alabilirsin.

**Mağaza** (\`Bakiye: ${data.coin.toFixed(0)} coin | Ses Lvl: ${data.voiceLevel} | Mesaj Lvl: ${data.messageLevel}\`)
\`\`\`${mesaj}\`\`\`
**Bilgilendirme:** Ürünleri satın almak için <@${magazasahibi}> adlı arkadaşımıza ulaşabilirsiniz.
`)

        return message.channel.send(embed);
    }
}
exports.conf = {
    aliases: ["coinmarket", "cs", "cm"]
}
exports.help = {
    name: 'Coinmarket'
}