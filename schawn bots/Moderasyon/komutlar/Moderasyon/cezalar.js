const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let ceza = require("../../models/ceza");
let moment = require("moment");
require("moment-timezone");
moment.locale("tr")

module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    
    if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
        let target = message.mentions.members.first() || await client.users.fetch(args[0]) || message.guild.members.cache.get(args[0]);
        if (!target) return client.Embed(message.channel.id, `Lütfen cezalarına bakmak istediğiniz kullanıcıyı etiketleyiniz!`)
        let data = await ceza.find({userID: target.id})
        if (data.length == 0) return message.reply("Bu kullanıcı daha önce bir ceza-i işleme tabi tutulmamış.")
        message.channel.send(data.length <=0 ? "Datacenter'da kaydedilen bir veri görüntülenemedi" : `${target} kişisinin ceza bilgileri aşağıda belirtilmiştir. Tekli bir cezaya bakmak için \`${conf.prefix[0]}ceza ID\` komutunu uygulayınız.`)
let uyeDurum;
if (data.length < 5) uyeDurum = 'Çok güvenli!';
if (data.length >= 5 && data.length < 10) uyeDurum = 'Güvenli!';
if (data.length >= 10 && data.length < 15) uyeDurum = 'Şüpheli!';
if (data.length >= 15 && data.length < 20) uyeDurum = 'Tehlikeli!';
if (data.length >= 20) uyeDurum = 'Çok tehlikeli!';

        client.splitEmbedWithDesc(`
${message.guild.name} sunucunda ${target} kullanıcısının tüm cezaları aşağıda listenmiştir. Cezaların hiçbiri silinmemektedir,

**Son Ceza-i İşlemi**
${data.map(veri => `\`\`\`php
ID => ${veri.ID}
Ceza Durumu: ${veri.Sebep == "AFFEDILDI" ? "🔴 (Bitti)" : veri.Bitis == "null" ? "🟢 (Devam Ediyor)" : veri.Bitis == "KALICI" ? "🟢 (Devam Ediyor)" : Date.now()>=veri.Bitis ? "🔴 (Bitti)" : "🟢 (Devam Ediyor)"}
Yetkili => ${message.guild.members.cache.get(veri.Yetkili) ? message.guild.members.cache.get(veri.Yetkili).displayName : veri.Yetkili}
Puan => ${veri.Puan}
Tür => ${veri.Ceza}
Sebep => ${veri.Sebep}
Bitiş Tarihi => ${veri.Bitis == "null" ? "KALICI" : veri.Bitis == "KALICI" ? "KALICI" : moment(Number(veri.Bitis)).locale("tr").format("LLL")}
\`\`\`
`).reverse()[0]}**Son 10 Ceza-i İşlemler** (\`Toplam: ${data.length} Ceza - ${uyeDurum}\`)

${data.reverse().slice(0,10).map( (data, index) => `#${data.ID} **[${data.Ceza.toUpperCase()}]** (${data.Bitis == "null" ? "Aktif" : data.Bitis == "KALICI" ? "Aktif" : Date.now()>=data.Bitis ? "Kapalı" : "Aktif"}) \`${new Date(Number(data.Atilma)).toTurkishFormatDate()}\` tarihinde **${data.Sebep}** nedeniyle ${message.guild.members.cache.has(data.Yetkili) ? message.guild.members.cache.get(data.Yetkili).toString() : data.Yetkili} tarafından cezalandırıldı!`).join("\n")}
`,
            { name: message.guild.name, icon: message.guild.iconURL({ dynamic: true, size: 2048 }) },
            false,
            { setColor: ['BLUE'] }).then(list => {
                list.forEach(item => {
                    message.channel.send(message.channel, item);
                });
            });
    

    } else return;
}
exports.conf = {aliases: ["sicil", "Cezalar", "Sicil"]}
exports.help = {name: 'cezalar'}

Date.prototype.toTurkishFormatDate = function () {
    return moment.tz(this, "Europe/Istanbul").format('LLL');
  };