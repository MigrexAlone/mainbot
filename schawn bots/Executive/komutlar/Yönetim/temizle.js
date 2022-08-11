const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (message.member.hasPermission("MANAGE_CHANNELS") || durum) {
        const sayi = args[0]
        if (!sayi) return message.reply("En Az `1 - 100` Arasında Bir Tam Sayı Değeri Girmelisiniz.")
        if (sayi >= 101) return message.reply("En Az `1 - 100` Arasında Bir Tam Sayı Değeri Girmelisiniz.")
        let messages = await message.channel.messages.fetch({
            limit: sayi
        });
        let mesaj = await message.channel.bulkDelete(messages, true);
        if (!mesaj.size) {
            return message.reply("En Az `1 - 100` Arasında Bir Tam Sayı Değeri Girmelisiniz.").then(x => x.delete({timeout: 5000}))
        };
        message.reply(`${mesaj.size} Adet Mesaj Başarılı Bir Şekilde Silindi`).then(x => x.delete({timeout: 100}))
    } else {
        return message.reply("Bu komutu kullanabilmek için Ozel Rol Sorumlusu ya da Yönetici olmalısın.")
    };
};
exports.conf = {aliases: ["sil", "clear", "clean", "oglumsohbettemizlendi", "hahaha", "pepe"]}
exports.help = {name: 'temizle'}
