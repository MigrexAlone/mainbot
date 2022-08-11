const {MessageEmbed} = require("discord.js");
const conf = client.ayarlar
let ozelKomut = require("../../models/özelkomut");
module.exports.run = async (client, message, args, durum, kanal) => {
  if (!message.guild) return;
  if (message.member.hasPermission('MANAGE_CHANNELS') || durum) {
    let göster = await ozelKomut.find({guildID: message.guild.id, YetkiliROL: true})
    let arr = []
	let veri = göster.map(x => x.YetkiliData)
	veri.forEach(v => v.forEach(x => arr.push(x)));
	let loading = await message.channel.send("Veriler yükleniyor...");
    let kayitcilar = {};
    arr.forEach((value) => {
      if (kayitcilar[value.Author]) kayitcilar[value.Author] += 1;
      else kayitcilar[value.Author] = 1
    })
    let sirali = Object.keys(kayitcilar).sort((a, b) => kayitcilar[b] - kayitcilar[a]).splice(0, 30).map(e => ({
      User: e,
      Value: kayitcilar[e]
    }))
    sirali = sirali.map((user, index) => `**${index+1}.** <@${user.User}> (\`${user.User}\`) \`${user.Value} Yetkili.\``).join("\n")
    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(conf.footer)
      .setAuthor(message.author.tag, message.author.avatarURL({
        dynamic: true
      }))
      .setDescription(`Top 25 Yetki aldırma sıralaması aşağıda belirtilmiştir.\n\n${sirali.length > 0 ? sirali : "Veri yoktur"}`)
	  loading.delete()
    return message.channel.send(embed);
  }
}
exports.conf = {
  aliases: ["ytop"]
}
exports.help = {
  name: 'yetkitop'
}
