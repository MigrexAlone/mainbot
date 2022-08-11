const {
	MessageEmbed,
	Discord
} = require("discord.js");
let sunucuayar = require("../../models/sunucuayar");
let uyarı = require("../../models/uyarı");
let moment = require("moment");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
	let data = await sunucuayar.findOne({});
	if (durum) {
		let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let reason = args.splice(1).join(" ");
		if (!reason) return message.reply("Lütfen bir uyarı sebebi belirtiniz.")
		if (!target) return message.reply("Lütfen bir kullanıcı belirleyiniz");
		let miktar = await uyarı.find({userID: target.id})
		miktar = miktar.length;
		let newData = uyarı({
			userID: target.id,
			Type: {Sebep: reason, Tarih: Date.now()}
		})
		newData.save().then(data => {
			if (!data) return;
			message.channel.send(`Başarılı bir şekilde <@${data.userID}> adlı üye ${data.Type.Sebep} sebebiyle ${moment(data.Type.Tarih).locale("tr").format("LLL")} tarihinde ${miktar+1} adet uyarı aldı`)
		})
	} else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici ya da Jail Sorumlusu olmalısınız!`)
}
exports.conf = {
	aliases: ["uyar"]
}
exports.help = {
	name: 'uyarı'
}