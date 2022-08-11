let sunucuayar = require("../../models/sunucuayar");
let vmuteInterval = require("../../models/vmuteInterval");
let muteInterval = require("../../models/muteInterval");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    let data = await sunucuayar.findOne({});
    await message.react(`${client.emojis.cache.find(x => x.name === "schawn_unmute")}`);
    await message.react(`${client.emojis.cache.find(x => x.name === "schawn_vunmute")}`);
    const filter = (reaction, user) => {
        return ["schawn_unmute", "schawn_vunmute"].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    const collector = message.createReactionCollector(filter, {
        max: 1,
        time: 30000,
        error: ['time']
    });

    collector.on("collect", async (reaction) => {
        message.reactions.removeAll();
        message.react(`${client.emojis.cache.find(x => x.name === "schawn_tik")}`);
        if(reaction.emoji.name == "schawn_unmute") {
            let muteRol = data.MUTED;
            if (await client.permAyar(message.author.id, message.guild.id, "mute") || durum) {
                let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!target) return message.reply("Lütfen bir kullanıcı belirleyiniz");
                if (!target.roles.cache.get(muteRol)) return message.reply("Etiketlediğiniz kullanıcı zaten mutesiz ?")
                muteInterval.deleteOne({userID: target.id}).exec()
                target.roles.remove(muteRol).then(async (user) => {
                        message.channel.send(`Başarılı bir şekilde <@${user.id}> adlı kullanıcının mutesini kaldırdınız.`)
                })
            } else return;
        } else if (reaction.emoji.name == "schawn_vunmute") {
            let muteRol = data.VMUTED;
            if (await client.permAyar(message.author.id, message.guild.id, "vmute") || durum) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply("Lütfen bir kullanıcı belirleyiniz");
            if (!target.roles.cache.get(muteRol)) return message.reply("Etiketlediğiniz kullanıcı zaten ses mutesiz ?")
            vmuteInterval.deleteOne({userID: target.id}).exec()
            target.roles.remove(muteRol).then(async (user) => {
            message.channel.send(`Başarılı bir şekilde <@${user.id}> adlı kullanıcının ses mutesini kaldırdınız.`)
            })
            target.voice.setMute(false).catch(() => {});
            } else return;
        }
    })


}
exports.conf = {aliases: ["unmute","unsesmute", "sesmute-kaldır", "unvoicemute", "voicemutekaldır", "unsmute"]}
exports.help = {name: 'unvmute'}
