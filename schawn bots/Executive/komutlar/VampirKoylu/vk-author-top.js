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
    
    let data2 = await sunucuayar.findOne({});
    const vkyonetici = data2.VKAuthor;
    if (!message.member.roles.cache.has(vkyonetici) && !message.member.permissions.has(8)) return;
    let vkdata = await vampirKoylu.findOne({});
    if (!vkdata) return;
    data = vkdata.Lobby;
    let kayitcilar = {};
    data.forEach((value) => {
        if (kayitcilar[value.Author]) kayitcilar[value.Author] += 1;
        else kayitcilar[value.Author] = 1
    });
    let sirali = Object.keys(kayitcilar).sort((a, b) => kayitcilar[b] - kayitcilar[a]).splice(0, 30).map(e => ({
        User: e,
        Value: kayitcilar[e]
    }))
    sirali = sirali.map((user, index) => `**${index+1}.** <@${user.User}> \`${user.Value} Oyun oynatmış.\``)
    let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setAuthor(message.author.tag, message.author.avatarURL({
            dynamic: true
        }))
        .setDescription(`Top 30 Vampir Köylü Yönetici sıralaması aşağıda belirtilmiştir.\n\n${sirali.length > 0 ? sirali : "Veri yoktur"}`);
    return message.channel.send(embed);
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["vktop"],
    permLevel: 0,
}

exports.help = {
    name: 'vk-top',
    description: 'Vampir Köylü oyununun oyun gidişatını görüntülemeye yaramaktadır',
    usage: 'vkdurum',
    kategori: 'Vampir Koylu'
}
