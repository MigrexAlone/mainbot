const { MessageEmbed, Discord, MessageAttachment } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");


module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
	let sec = args[0];
	let ayar = await sunucuayar.findOne({})
	let data = ayar.BAN_TAG
	let yasakliTagRol = ayar.BANTAG
	let kayitsizUyeROL = ayar.UNREGISTER
	let guvenliKisi = ayar.GKV
	
	if (guvenliKisi.includes(message.author.id)|| message.member.permissions.has(8) || message.author.id === message.guild.owner.id || durum) {
		if (["ekle", "Ekle", "add", "Add"].some(kontrol => kontrol === sec)) {
			let tags = args[1];
			if (data.includes(tags)) return client.Embed(message.channel.id, `Eklemeye çalıştığın \`${tags}\` tagı zaten yasaklı taglar listesinde`)
			sunucuayar.findOne({}, async (err, data) => {
				await data.BAN_TAG.push(tags),data.save().then(async (data) => {
					await message.channel.send(`Başarılı bir şekilde \`${tags}\` tagını yasaklı taglar listesine ekledin Bu Tagdaki Üye Sayısı: ${message.guild.members.cache.filter(u => u.user.username.includes(tags)).size}`)
					await message.guild.members.cache.filter(u => u.user.username.includes(tags)).array().forEach(async (uye, index) => {
						setTimeout(async () => {
							await uye.roles.set([yasakliTagRol]).catch(() => {})
						}, index*500)
					});
				})
			})
		}
		if (["kaldır", "sil", "remove", "delete", "Sil"].some(kontrol => kontrol === sec)) {
		
		let tags = args[1];
		if (!data.includes(tags)) return client.Embed(message.channel.id, `Silmeye çalıştığın \`${tags}\` tagı zaten yasaklı tag listesinde yoktur!`)
		sunucuayar.findOne({}, async (err, data) => {
			let arr = await sunucuayar.findOne({}).then(x => x.BAN_TAG);
			removeItemOnce(arr, tags)
			data.BAN_TAG = arr,data.save().then(async (data) => {
				await message.channel.send(`Başarılı bir şekilde \`${tags}\` tagını yasaklı taglar listesinden çıkardınız Bu Tagdaki Üye Sayısı: ${message.guild.members.cache.filter(u => u.user.username.includes(tags)).size}`)
				await message.guild.members.cache.filter(u => u.user.username.includes(tags)).array().forEach(async (uye, index) => {
					setTimeout(async () => {
						await uye.roles.set(kayitsizUyeROL).catch(() => {});
					}, index*500);
				});
				
			});
		});
		};
		
		if (!sec) {
			let data = await sunucuayar.findOne({}).then(x => x.BAN_TAG);
			let embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter(conf.footer)
			.setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
			.setDescription(`
	\`${message.guild.name}\` adlı sunucumuzun yasaklı tag listesi;
	
		${data.map(x => {
			return {
				Id: x,
				Total: message.guild.members.cache.filter(u => u.user.username.includes(x)).size
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 15).map((user, index) => `\`${index + 1}.\` **${user.Id}** (\`${user.Total} kişi\`)`).join("\n") || "\`\`\`Datacenter'da kaydedilen bir veri görüntülenemedi\`\`\`"}
			`)
		
			return await message.channel.send(embed)
		}
	} else return client.Embed(message.channel.id, `Bu komutu kullanabilmek için GKV - Yönetici - Sunucu Sahibi olman gerekmektedir`);
}
exports.conf = {aliases: ["yasaklitag", "bantag", "bannedtag"]}
exports.help = {name: 'yasaklıtag'}
function removeItemOnce(arr, value) { var index = arr.indexOf(value); if (index > -1) { arr.splice(index, 1); } return arr; }