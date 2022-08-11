let {
    MessageEmbed
} = require("discord.js");
let vampirKoylu = require("../../models/vampirKoylu");
let sunucuayar = require("../../models/sunucuayar");
const moment = require("moment");
const {
    update
} = require("../../models/vampirKoylu");
exports.run = async function (client, message, args, durum, kanal) {
    if (!message.guild) return
    
    let data = await sunucuayar.findOne({});
    const vkyonetici = data.VKAuthor;
    let prefix = client.ayarlar.prefix[0];
    if (!message.member.roles.cache.has(vkyonetici) && !message.member.permissions.has(8)) return message.reply("Yönetici ya da VK Sorumlusu olman gerekiyor!")
    if (!message.member.voice.channel) return message.reply(`Hata: Bu komutu kullanabilmek için bir ses kanalında olmanız gerekiyor`)

    await vampirKoylu.findOne({
        Guild: message.guild.id
    }, async (err, veri) => {
        if (!veri) return;
        let data = veri.Lobby;
        let data2 = veri.Oyun;
        let authorID = data.filter(veri => veri.Channel === message.member.voice.channel.id && veri.Type === true && veri.Author).map(user => user.Author)

        if (data2.filter(x => data.map(x => x.Channel).some(kanal => kanal === message.member.voice.channel.id) && x.Durum === true).map(x => x.Channel).some(kontrol => kontrol === message.member.voice.channel.id)) {
            if (!authorID.some(user => user == message.author.id)) return message.reply("Oyunu sadece oyun başlatıcı bitirebilir!");
            let lobi = data.filter(veri => veri.Channel === message.member.voice.channel.id && veri.Type === true);
            let oyun = data2.filter(veri => veri.Channel === message.member.voice.channel.id && veri.Durum === true && veri.ID === lobi[0].ID)
            let ID = veri.ID

            let roller = data2.filter(x => data.map(x => x.Channel).some(kanal => kanal === message.member.voice.channel.id) && x.Durum === true).map(x => x.Liste)[0]
            let kazananlar = oyun.map(veri => veri.Yasayanlar)[0]


            var projects = data;
            const objIndex = projects.findIndex(obj => lobi.some(obj2 => obj.ID === obj2.ID));
            const updatedObj = {
                ...projects[objIndex],
                Type: false
            };
            const updatedProjects = [...projects.slice(0, objIndex), updatedObj, ...projects.slice(objIndex + 1)];

            var projects2 = data2;
            const objIndex2 = projects2.findIndex(obj => oyun.some(obj2 => obj.ID === obj2.ID));
            const updatedObj2 = {
                ...projects2[objIndex2],
                Durum: false,
                Finish: Date.now(),
                Winners: kazananlar
            };
            const updatedProjects2 = [...projects2.slice(0, objIndex2), updatedObj2, ...projects2.slice(objIndex2 + 1)];
            veri.Lobby = updatedProjects
            veri.Oyun = updatedProjects2
            veri.save()
            let embed = new MessageEmbed()
                .setAuthor(message.member.nickname || message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setColor('RED')
                .setTimestamp()
                .setFooter(conf.footer)
                .setDescription(`**${ID}** ID'li oyunumuz bitti, bir sonraki oyun da görüşmek üzere

**Biten oyunun rolleri:**
${Object.keys(roller).length > 60 ? "Katılımcılar 10 kişiden fazla olduğu için listelenemedi" : Object.keys(roller).map(x => `<@${x}> **=>** \`[${capitalize(roller[x])}]\``).join("\n")}
**Kazananlar:**
${Object.keys(kazananlar).length > 10 ? "Kazanan Oyuncular 10 kişiden fazla olduğu için listelenemedi" : Object.keys(kazananlar).map(x => `<@${x}> **=>** \`[${capitalize(kazananlar[x])}]\``).join("\n")}

Bu oyun toplamda \`${moment.duration(oyun[0].Start-lobi[0].Date).format('H [saat,] m [dakika] s [saniye]')}\` sürdü
Bu oyun toplamda **${oyun[0].Gun} günde** bitti! ${oyun[0].Gun == 4 ? "(`Oyun gidişatı orta seviye`)" : oyun[0].Gun >= 6 ? "(`Bu oyun bitmek bilmedi güzeldi!`)" : "(\`Oyun hızlı bitti :(\`)" }`)
            return await message.channel.send(embed)
        }
        if (!data.map(x => x.Channel).some(kanal => kanal === message.member.voice.channel.id)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`Oyunu başlatmak için bir lobi oluşturmalısınız! (\`${prefix}vkstart\`)`))
        return message.reply("Lütfen bir lobi oluşturunuz")
    })
}
exports.conf = {aliases: ["vkson", "vkstop", "vkbitti"]}
exports.help = {name: 'vkbitir'}

function capitalize(s) {
    let x = s.toLowerCase();
    if (typeof x !== 'string') return ''
    return x.charAt(0).toUpperCase() + x.slice(1)
}