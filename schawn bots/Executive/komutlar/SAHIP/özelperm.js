const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

    if (durum) {
        let sec = args[0];
        if (!sec) return message.reply("Lütfen bir komut giriniz");
        if (sec == "bak") {
            let db = await client.db.find({
                guildID: message.guild.id
            });
            message.channel.send(`Özel Perm Bilgileri:`, {
                split: true,
                code: "md"
            })
            return message.channel.send(db.map((x, index) => `
(${index+1}) Komut Adı => ${x.komutAd} (${x.kisiler.length} adet kişi var) - (${x.roller.length} adet rol var)
Kişiler: ${x.kisiler.length != 0 ? x.kisiler.map(x => message.guild.members.cache.get(x).displayName) : "kişi yoktur"}
Roller: ${x.roller.length != 0 ? x.roller.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : "rol silinmiş") : "rol yoktur"}\n`).join("\n"), {
                split: true,
                code: "md"
            })
        }
        let rol = message.mentions.roles.map(r => r.id);
        let user = message.mentions.members.map(r => r.id);
        client.db.findOne({
            komutAd: sec,
            guildID: message.guild.id
        }, (err, res) => {
            if (!res) {
                let newData = new client.db({
                    guildID: message.guild.id,
                    komutAd: sec,
                    roller: rol,
                    kisiler: user,
                })
                message.reply(`Başarılı bir şekilde ${user.length > 0 && rol.length > 0 ? `${user.map(x => `<@${x}>`)} üyelerini ve ${rol.map(x => `<@&${x}>`)} rollerini ekledin` : rol.length > 0 ? rol.map(x => `<@&${x}>`)+ " rollerini ekledin" : user.length > 0 ? user.map(x => `<@${x}>`)+ " kişilerini ekledin" : ``}`)
                newData.save()
            } else {
                if (rol) {
                    res.roller = rol
                }
                if (user) {
                    res.kisiler = user
                }
                res.save();
                message.reply(`Başarılı bir şekilde ${user.length > 0 && rol.length > 0 ? `${user.map(x => `<@${x}>`)} üyelerini ve ${rol.map(x => `<@&${x}>`)} rollerini ekledin` : rol.length > 0 ? rol.map(x => `<@&${x}>`)+ " rollerini ekledin" : user.length > 0 ? user.map(x => `<@${x}>`)+ " kişilerini ekledin" : ``}`)
            }
        });
    };

};

exports.conf = {
    aliases: ["ÖzelPerm"]
};
exports.help = {
    name: 'özelperm'
};