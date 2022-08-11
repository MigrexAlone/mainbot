let {
    MessageEmbed
} = require("discord.js");
let vampirKoylu = require("../../models/vampirKoylu");
let sunucuayar = require("../../models/sunucuayar");
const moment = require("moment");

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let data = await vampirKoylu.findOne({});
    let ID = data.ID < Number(args[0]) || !Number(args[0]) ? "hepsi" : Number(args[0])

    let lobiler = data.Lobby.reverse()
    lobiler = data.Lobby
    lobiler = lobiler[0]
    let lobiID = data.Lobby.filter(oyun => oyun.ID === ID)[0]
    let kazananlar = data.Oyun.reverse()
    kazananlar = data.Oyun[0].Winners
    let kazananID = data.Oyun.filter(oyun => oyun.ID === ID).map(x => x.Winners)[0]

    let bitisSuresi = data.Oyun.filter(oyun => oyun.ID === ID && oyun.Finish).map(x => x.Finish)[0]
    let bitisSuresi2 = data.Oyun.filter(oyun => oyun.ID === data.ID && oyun.Finish).map(x => x.Finish)[0]

    let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(client.ayarlar.footer)
        .setAuthor(message.author.tag, message.author.avatarURL({
            dynamic: true
        }))
        .addField(`${ID === "hepsi" ? `**Son oynanan oyunun lobi bilgisi!**` : `\`#${ID}\` **numaralı lobinin bilgisi!**`}`, `
${ID != "hepsi" ? `
ID: \`#${lobiID.ID}\`
Kanal: \`${message.guild.channels.cache.get(lobiID.Channel).name}\`
Yönetici: <@${lobiID.Author}> (\`${lobiID.Author}\`)
Başlangıç Tarihi: \`${moment(lobiID.Date).locale("tr").format("LLL")}\`
Oyun Bitiş Tarihi: \`${moment(bitisSuresi).locale("tr").format("LLL")}\`
Geçen Zaman: \`${moment.duration(bitisSuresi-lobiID.Date).format("H [saat] m [dakika] s [saniye]")}\`
Oyun Durumu: \`${lobiID.Type === false ? "Bitti": "Devam Ediyor"}\`
` : `
ID: \`#${lobiler.ID}\`
Kanal: \`${message.guild.channels.cache.get(lobiler.Channel).name}\`
Yönetici: <@${lobiler.Author}> (\`${lobiler.Author}\`)
Başlangıç Tarihi: \`${moment(lobiler.Date).locale("tr").format("LLL")}\`
Oyun Bitiş Tarihi: \`${moment(bitisSuresi2).locale("tr").format("LLL")}\`
Geçen Zaman: \`${moment.duration(bitisSuresi2-lobiler.Date).format("H [saat] m [dakika] s [saniye]")}\`
Oyun Durumu: \`${lobiler.Type === false ? "Bitti": "Devam Ediyor"}\`
`}`)
        .addField(`${ID === "hepsi" ? `**Son oynanan oyunun kazananı/kazananları!**` : `\`#${ID}\` **numaralı oyunun kazananları!**`}`,`

${ID != "hepsi" ? `${Object.keys(kazananID).map((user, index) => `**${index+1}.** <@${user}> **=>** \`[${capitalize(kazananID[user])}]\``).join("\n")}` : 
`${Object.keys(data.Oyun[0].Winners).map((user, index) => `**${index+1}.** <@${user}> **=>** \`[${capitalize(kazananlar[user])}]\``).join("\n")}`}
`)
    message.channel.send(embed)
}
exports.conf = {
    aliases: ["vk-lobiID", "vk-kazananlar", "vk-kazanan", "vk-lobi"]
}
exports.help = {
    name: 'vk-lobiler'
}
function capitalize(s) {
    let x = s.toLowerCase();
    if (typeof x !== 'string') return ''
    return x.charAt(0).toUpperCase() + x.slice(1)
}