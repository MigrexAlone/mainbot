const {
        MessageEmbed,
        Discord
} = require("discord.js");
const conf = client.ayarlar;
let ozelKomut = require("../../models/özelkomut");
module.exports.run = async (client, message, args, durum, kanal) => {
        if (!message.guild) return;
        


        if (await client.permAyar(message.author.id, message.guild.id, "global") || durum) {
                let data = await ozelKomut.find({guildID: message.guild.id}) || [];
                let embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(client.ayarlar.footer)
                        .setAuthor(message.author.tag, message.author.avatarURL({
                                dynamic: true
                        }))
                        .setDescription(`
\`${client.ayarlar.prefix[0]}denetim @rol\`
\`${client.ayarlar.prefix[0]}puanekle @kişi [miktar]\`
\`${client.ayarlar.prefix[0]}stats-sıfırla @rol\`
\`${client.ayarlar.prefix[0]}ystat\`
\`${client.ayarlar.prefix[0]}davet\`
\`${client.ayarlar.prefix[0]}davet kanal [#kanal]\`
\`${client.ayarlar.prefix[0]}topdavet\`
\`${client.ayarlar.prefix[0]}isim @etiket [isim] [yaş]\`
\`${client.ayarlar.prefix[0]}isimler @etiket\`
\`${client.ayarlar.prefix[0]}kayıt @etiket [isim] [yaş]\`
\`${client.ayarlar.prefix[0]}teyitbilgi\`
\`${client.ayarlar.prefix[0]}topteyit\`
\`${client.ayarlar.prefix[0]}dağıt\`
\`${client.ayarlar.prefix[0]}kanal [aç]/[kapat]\`
\`${client.ayarlar.prefix[0]}not al [baslik] - [icerik] - [link (isteğe bağlı)]\`
\`${client.ayarlar.prefix[0]}özelkomut [oluştur] / [güncelle] / [bak komutAD]\`
\`${client.ayarlar.prefix[0]}sessay @rol\`
\`${client.ayarlar.prefix[0]}setup [ayar]\`
\`${client.ayarlar.prefix[0]}setup2\`
\`${client.ayarlar.prefix[0]}sorumluluk [oluştur] / [kişiler] / [bak sorumlulukAd]\`
\`${client.ayarlar.prefix[0]}sil [miktar] 1-100\`
\`${client.ayarlar.prefix[0]}yasaklıtag [ekle] / [kaldır]\`
\`${client.ayarlar.prefix[0]}yetki [ayarla] / [ver] / [al] / [bilgi] / [bilgi top]\`
\`${client.ayarlar.prefix[0]}yoklama\`
\`${client.ayarlar.prefix[0]}afk [sebep / Opsiyonel]\`
\`${client.ayarlar.prefix[0]}alarm [zaman] [sebep]\`
\`${client.ayarlar.prefix[0]}bilgi\`
\`${client.ayarlar.prefix[0]}booster [nickname]\`
\`${client.ayarlar.prefix[0]}cihaz @etiket\`
\`${client.ayarlar.prefix[0]}çek @etiket\`
\`${client.ayarlar.prefix[0]}git @etiket\`
\`${client.ayarlar.prefix[0]}izinliçek @etiket\`
\`${client.ayarlar.prefix[0]}izinligit @etiket\`
\`${client.ayarlar.prefix[0]}snipe\`
\`${client.ayarlar.prefix[0]}tag\`
\`${client.ayarlar.prefix[0]}link\`
\`${client.ayarlar.prefix[0]}ban @etiket\`
\`${client.ayarlar.prefix[0]}banbilgi [userID]\`
\`${client.ayarlar.prefix[0]}ceza-bilgi @etiket / [userID]\`
\`${client.ayarlar.prefix[0]}cezaID [ID]\`
\`${client.ayarlar.prefix[0]}cezalar @etiket / [userID]\`
\`${client.ayarlar.prefix[0]}dc-cezalı @etiket [süre] [sebep]\`
\`${client.ayarlar.prefix[0]}jail @etiket\`
\`${client.ayarlar.prefix[0]}kayıtsız @etiket\`
\`${client.ayarlar.prefix[0]}mute @etiket [süre] [sebep]\`
\`${client.ayarlar.prefix[0]}reklam @etiket\`
\`${client.ayarlar.prefix[0]}say\`
\`${client.ayarlar.prefix[0]}sesli\`
\`${client.ayarlar.prefix[0]}soruncozme [başlat @etiket] / [bitir] / [bilgi @etiket] / [top]\`
\`${client.ayarlar.prefix[0]}taglı @etiket\`
\`${client.ayarlar.prefix[0]}terapi [başlat @etiket] / [bitir] / [bilgi @etiket] / [top]\`
\`${client.ayarlar.prefix[0]}temp-jail @etiket [süre] [sebep]\`
\`${client.ayarlar.prefix[0]}unban [userID]\`
\`${client.ayarlar.prefix[0]}unjail @etiket / [userID]\`
\`${client.ayarlar.prefix[0]}unmute @etiket / [userID]\`
\`${client.ayarlar.prefix[0]}vk-cezalı @etiket [süre] [sebep]\`
\`${client.ayarlar.prefix[0]}yargı [userID] [sebep]\`
\`${client.ayarlar.prefix[0]}coin\`
\`${client.ayarlar.prefix[0]}coinmarket\`
\`${client.ayarlar.prefix[0]}toplevel\`
\`${client.ayarlar.prefix[0]}level\`
\`${client.ayarlar.prefix[0]}stat\`
\`${client.ayarlar.prefix[0]}topstat\`
\`${client.ayarlar.prefix[0]}ses-bilgi @etiket\`
`)
.addField("Vampir Köylü Komutlar", `\`${client.ayarlar.prefix[0]}vktop\`
\`${client.ayarlar.prefix[0]}vkbitir\`
\`${client.ayarlar.prefix[0]}vkdurum\`
\`${client.ayarlar.prefix[0]}vkekle @etiket\`
\`${client.ayarlar.prefix[0]}vkgece\`
\`${client.ayarlar.prefix[0]}vkgunduz\`
\`${client.ayarlar.prefix[0]}vk-lobi [ID]\`
\`${client.ayarlar.prefix[0]}vköldür @etiket\`
\`${client.ayarlar.prefix[0]}vkroller [1vampir 1büyücü 1jester]\`
\`${client.ayarlar.prefix[0]}vkstart\``)
.addField("Özel Komutlar", `${data.length > 0 ? data.map(x => `\`${client.ayarlar.prefix[0]}${x.komutAd} @etiket\``).join("\n"): "Özel Komut Yoktur."}`)
message.channel.send(embed);
} else return;
}
exports.conf = {
        aliases: ["Yardım"]
}
exports.help = {
        name: 'yardım'
}