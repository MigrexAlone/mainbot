const {
    MessageEmbed
} = require("discord.js");
let ekipKomut = require("../../models/ekip");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

    let sunucuData = await sunucuayar.findOne({
        guildID: message.guild.id
    });
    if (durum || sunucuData.GKV.includes(message.author.id) || message.author.id == message.guild.owner.id || client.ayarlar.sahip.includes(message.author.id)) {
        let sec = args[0];
        if (["oluştur"].includes(sec)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let ekipKomutDATA = await ekipKomut.findOne({
                guildID: message.guild.id,
                ekipRol: rol.id
            });
            if (ekipKomutDATA) return message.reply("Bu isimde zaten bir ekip mevcut");
            let newData = ekipKomut({
                guildID: message.guild.id,
                ekipRol: rol.id,
            });
            newData.save();
            message.channel.send("Başarılı")
        }
        if (["sil"].includes(sec)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let ekipKomutDATA = await ekipKomut.findOne({
                guildID: message.guild.id,
                ekipRol: rol.id,
            })
            if (!ekipKomutDATA) return message.reply("Lütfen bir ekip rolü giriniz");
            message.reply(`başarılı bir şekilde ${rol} ekibini sildim.`);
            await ekipKomut.deleteOne({
                guildID: message.guild.id,
                ekipRol: rol.id
            }).exec();
        };
        if (["bak"].includes(sec)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!rol) return message.reply("Lütfen bir ekip rolü giriniz.")
            let data2 = await ekipKomut.findOne({
                guildID: message.guild.id,
                ekipRol: rol.id
            });
            if (!data2) return
            let mesaj = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(client.ayarlar.footer)
                .setAuthor(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .addField("Ekip üyeleri (" + rol.members.size + " kişi)", `${rol.members.size < 100 ? rol.members.map(x => `${x} [\`${x.displayName}\`] (\`${x.id}\`)`).join("\n") : "100'den fazla kişi olduğu için listeleyemiyorum."}`)
                .addField("Seste olan üyeler (" + rol.members.filter(x => x.voice.channel).size + " kişi)", `${rol.members.filter(x => x.voice.channel).size < 100 ? rol.members.filter(x => x.voice.channel).map(x => `${x} [\`${x.displayName}\`] (\`${x.id}\`)`).join("\n") : "100'dan fazla kişi olduğu için listeleyemiyorum."}`)
            message.channel.send(mesaj)
            message.channel.send(`Aktif olmayanları etiketlemek için:\n\`\`\`${rol.members.filter(x => !x.voice.channel && x.presence.status !== "offline").map(x => `(<@${x.id}>)`)}\`\`\`\n`)
        };
        if (!sec) {
            let loading = await message.channel.send("Veriler yükleniyor...")
            let data = await ekipKomut.find({
                guildID: message.guild.id
            });
            let totalAktif = 0;
            let totalSesteki = 0;
            let totalUnSesteki = 0;
            let tümYetkililer = 0;
            let göster = data.length > 0 ? data.map((veri, index) => {
                tümYetkililer += message.guild.roles.cache.get(veri.ekipRol).members.size
                totalAktif += message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.presence.status !== "offline").size
                totalSesteki += message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.presence.status !== "offline" && x.voice.channel).size
                totalUnSesteki += message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.presence.status !== "offline" && !x.voice.channel).size
                return {
                    Mesaj: `<@&${veri.ekipRol}> **Ekip Bilgileri**\n\nToplam Üye: \`${message.guild.roles.cache.get(veri.ekipRol).members.size} kişi\`\nÇevrimiçi Üye: \`${message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.presence.status !== "offline").size} kişi\`\nSesteki Üye: \`${message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.voice.channel).size} kişi\`\nSeste Olmayan Üye: \`${message.guild.roles.cache.get(veri.ekipRol).members.filter(x => !x.voice.channel && x.presence.status !== "offline").size} kişi\`\n─────────────────────`
                }
            }).map(x => `${x.Mesaj}`).join("\n") : "Veri yoktur.";

            loading.delete();
            message.channel.send(new MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({
                dynamic: true
            })).setTimestamp().setFooter(client.ayarlar.footer).setDescription(`
Aşağıdaki ekip üyelerini'ı daha detaylı bir şekilde görmek için aşağıdaki komutu yazınız.
\`.ekip bak @ekiprol\`
─────────────────────
Toplam Üyeler: \`${tümYetkililer} kişi\`
Çevrimiçi Üyeler: \`${totalAktif} kişi\`
Sesteki Üyeler: \`${totalSesteki} kişi\`
Seste Olmayan Üyeler: \`${totalUnSesteki} kişi\`
─────────────────────
${göster}`));
        };
    } else return;
};
exports.conf = {
    aliases: ["ekip"]
}
exports.help = {
    name: 'Ekip'
}