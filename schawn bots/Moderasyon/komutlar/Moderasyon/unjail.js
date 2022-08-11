const {
	MessageEmbed,
	Discord
} = require("discord.js");
const conf = client.ayarlar
let jailInterval = require("../../models/jailInterval");
let sunucuayar = require("../../models/sunucuayar");
const ceza = require("../../models/ceza");
const otologin = require("../../models/otokayit");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
	let data = await sunucuayar.findOne({guildID: message.guild.id});
	let jailRol = data.JAIL;
	let booster = data.BOOST
	let kayitsizUyeRol = data.UNREGISTER
	let tag = data.TAG;
	let tag2 = data.TAG2
	if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
		let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!target) return message.reply("Lütfen bir kullanıcı belirleyiniz");
		if (!target.roles.cache.get(jailRol)) return message.reply("Etiketlediğiniz kullanıcı zaten jailsiz ?")
		let cezalar = await ceza.find({userID: target.id})
		if (cezalar.length == 0) {
			cezalar = [{Puan: 0}, {Puan: 0}]
		}
		if (cezalar.map(x => x.Puan).reduce((a,b) => a+b) >= 200 && message.author.id !== message.guild.owner.id && !client.ayarlar.sahip.includes(message.author.id)) return message.reply("Ceza Puanı 200 ve üstü kullanıcıların jailini sadece kurucular kaldırabilir!")
		let loading = await message.channel.send("Jail kaldırılıyor...")
		let otokayitDB = await otologin.findOne({userID: target.id})
		if (otokayitDB) {
			await target.roles.remove(jailRol).then(async x => {
				otokayitDB.roleID.forEach(async (res,i) => {
					setTimeout(async () => {
						await x.roles.add(res)
					},i*1000)
				});
				loading.delete();
				message.channel.send(`Başarılı bir şekilde <@${target.id}> adlı kullanıcının jailini kaldırdınız.`)
					await ceza.updateOne({
						"userID": target.id,
						"Yetkili": message.author.id,
						"Ceza": "JAIL",
						"Bitis": "KALICI",
					}, {
						$set: {
							Sebep: "AFFEDILDI",
							Bitis: Date.now()
						}
					}).exec();
					await jailInterval.deleteOne({
						userID: target.id
					})
			})
		} else {
			await target.roles.remove(jailRol).then(async x => {
				kayitsizUyeRol.forEach(async (res,i) => {
					setTimeout(async () => {
						await x.roles.add(res)
					},i*1000)
				});
				loading.delete();
				message.channel.send(`Başarılı bir şekilde <@${target.id}> adlı kullanıcının jailini kaldırdınız.`)
					await ceza.updateOne({
						"userID": target.id,
						"Yetkili": message.author.id,
						"Ceza": "JAIL",
						"Bitis": "KALICI",
					}, {
						$set: {
							Sebep: "AFFEDILDI",
							Bitis: Date.now()
						}
					}).exec();
					await jailInterval.deleteOne({
						userID: target.id
					})
			})
		}
	} else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için Yönetici ya da Jail Sorumlusu olmalısınız!`)
}
exports.conf = {
	aliases: ["Unjail", "cezalıkaldır", "kaldırcezalı", "UNJAİL", "UNJAIL"]
}
exports.help = {
	name: 'unjail'
}