const { MessageEmbed, Discord } = require("discord.js");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (!message.member.voice.channel) return message.channel.send(`Bir ses kanalında olman gerek`);
	let kullanici = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!kullanici) return message.reply("Lütfen bir kullanıcı etiketleyiniz veya ID'si giriniz.");
    if (!kullanici.voice.channel) return message.channel.send("Bu Kullanıcı Bir Ses Kanalında Değil");
    if (message.member.voice.channel.id === kullanici.voice.channel.id) return message.channel.send("Zaten Aynı Kanaldasınız.");

    if (message.member.hasPermission('MANAGE_MESSAGES') || durum) {
        message.member.voice.setChannel(kullanici.voice.channel);
    } else {
        const filter = (reaction, user) => {
            return ['✅'].includes(reaction.emoji.name) && user.id === kullanici.id;
        };
        let teklif = new MessageEmbed()
            .setColor("BLUE")
            .setDescription(`${kullanici}, ${message.author} **${kullanici.voice.channel.name}** Odasına Gelmek İstiyor.`);
        let mesaj = await message.channel.send(teklif)
        await mesaj.react("✅");
        mesaj.awaitReactions(filter, {
            max: 1,
            time: 1000 * 15,
            errors: ['time']
        }).then(collected => {
            const reaction = collected.first();
            if (reaction.emoji.name === '✅') {
                mesaj.edit("Başarılı bir şekilde odaya gittiniz").then(x => x.delete({ timeout: 100 }))
                message.member.voice.setChannel(kullanici.voice.channel)
            } 
        }).catch(() => {
            mesaj.edit("Süre dolduğu için odaya gitme işleminiz iptal edildi").then(x => x.delete({timeout: 1000}))
        });
    };
}
exports.conf = {aliases: ["go", "Git", "Go"]}
exports.help = {name: 'git'}
