const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar

let mongoose = require("mongoose");
let stringTabe = require("string-table");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
let moment = require("moment");
moment.locale("tr")
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    

    let ayar = await sunucuayar.findOne({})
    if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
        
        let target = Number(args[0])
        if (!target) return client.Embed(message.channel.id, `Lütfen cezalarına bakmak istediğiniz ID'yi giriniz!`)
        let data = await ceza.find({}).then(x => x)
        let embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`${data.filter(x => Number(x.ID) == target).map(veri => `
        
${message.guild.members.cache.get(veri.userID) ? `<@${veri.userID}> (<@&${message.guild.members.cache.get(veri.userID).roles.highest.id}>)` : `(\`${veri.userID}\`) ID'li`} kişisine uygulanan ${target} numaralı ceza bilgisi;

**Ceza Türü** 
${veri.Ceza}

**Ceza Sebebi**
${veri.Sebep}

**Ceza Atan Yetkili**
<@${veri.Yetkili}>

**Ceza Başlangıç**
${moment(Number(veri.Atilma)).format('LLL')}

**Ceza Bitiş**
${veri.Bitis == "KALICI" ? "KALICI" : veri.Bitis == "AFFEDILDI" ? "AFFEDILDI" : moment(Number(veri.Bitis)).format('LLL') }        

        `)}`)
        await message.channel.send(embed);

    } else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Kayıt Sorumlusu veya Yönetici olmalısınız!`)
}
exports.conf = {aliases: ["cezaID"]}
exports.help = {name: 'ceza'}
