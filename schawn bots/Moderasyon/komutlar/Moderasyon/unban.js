const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    let data = await sunucuayar.findOne({});
    
    let banSorumlusu = data.BANAuthorized
    let banLogKanal = data.BANChannel
    if (await client.permAyar(message.author.id, message.guild.id, "unban") || durum || client.ayarlar.sahip.includes(message.author.id)) {

        let target = args.slice(0)
        if (!target) return message.reply("Lütfen açmak istediğiniz kişinin ID'sini belirtiniz");
        if (target === message.author.id) return message.reply("Kendini banını nasıl açmayı düşünüyorsun ?");
        let cezaDATA = await ceza.findOne({userID: target, Ceza: "YARGI", Bitis: "null"})
        if(cezaDATA && !data.GKV.includes(message.author.id) && !client.ayarlar.sahip.includes(message.author.id)) return message.reply("Etiketlediğiniz kullanıcının banını sadece sunucu sahipleri açabilir.");
        
        
        client.users.fetch(target).then(user => {

            if (cezaDATA && data.GKV.includes(message.author.id) || client.ayarlar.sahip.includes(message.author.id)) {
                ceza.updateOne({userID: target, Ceza: "YARGI", Bitis: "null"}, {$set: {Bitis: Date.now()}}).exec();
            }
            let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(conf.footer)
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setDescription(`
**Ban Kaldırıldı!**

**Kaldıran Yetkili:** ${message.author} (\`${message.author.id}\`)
**Banı Kaldırılan Üye:** ${user.tag} (\`${user.id}\`)
            `)
            client.channels.cache.get(banLogKanal).send(embed);
            message.react(client.emojis.cache.find(x => x.name === "schawn_tik"))
            message.guild.members.unban(user.id)
        })

     } else return;
}
exports.conf = {aliases: ["bankaldır", "Unban", "UNBAN"]}
exports.help = {name: 'unban'}
