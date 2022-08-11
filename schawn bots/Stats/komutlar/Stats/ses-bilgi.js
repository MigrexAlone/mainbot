const {
    MessageEmbed
} = require("discord.js");
module.exports.run = async (client, message, args, durum, kanal) => {
            if (!message.guild) return;
            

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
            if (!user) return client.yolla("Ses bilgisine bakmak istediğin kullanıcıyı düzgünce belirt ve tekrar dene!", message.author, message.channel)
            if (!user.voice.channel) return client.yolla("<@" + user.id + "> bir ses kanalına bağlı değil.", message.author, message.channel)
            let mic = user.voice.selfMute == true ? "Kapalı" : "Açık"
            let hop = user.voice.selfDeaf == true ? "Kapalı" : "Açık"
            let süresi = client.channelTime.get(user.id)
            await client.yolla(`${user} kişisi <#${user.voice.channel.id}> kanalında. **Mikrofonu: ${mic}, Kulaklığı: ${hop}**
Kanala gitmek için [tıklaman](${await user.voice.channel.createInvite({maxAge: 10 * 60 * 1000, maxUses: 1 },)}) yeterli 
${süresi ? `\`\`\`Aktif Bilgiler:\`\`\`
<#${user.voice.channel.id}> kanalına \`${await client.turkishDate(Date.now() - süresi.time)}\` önce giriş yapmış.` : ""}`, message.author, message.channel)
}
exports.conf = {aliases: ["sesbilgi"]}
exports.help = {name: 'ses-bilgi'}


