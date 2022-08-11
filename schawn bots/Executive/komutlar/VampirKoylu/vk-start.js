let {
	MessageEmbed
} = require("discord.js");
let vampirKoylu = require("../../models/vampirKoylu");
let sunucuayar = require("../../models/sunucuayar");
const moment = require("moment");
exports.run = async function (client, message, args, durum, kanal) {
	if (!message.guild) return
	
	let data = await sunucuayar.findOne({});
	const vkyonetici = data.VKAuthor;

	if (!message.member.roles.cache.get(vkyonetici) && !message.member.permissions.has(8)) return message.reply("Yönetici ya da VK Sorumlusu olman gerekiyor!")
	if (!message.member.voice.channel) return message.reply(`Hata: Bu komutu kullanabilmek için bir ses kanalında olmanız gerekiyor`)
	let sestekiUyeler = message.member.voice.channel.members.filter(member => !member.voice.serverDeaf && message.member.id != member.id).array();
	if(sestekiUyeler.length < 2) return message.channel.send("Bu oyunun başlayabilmesi için 5'den fazla üye olması gerekiyor!");
	await vampirKoylu.findOne({
		Guild: message.guild.id
	}, async (err, data) => {
		if (!data) {
			let newData = new vampirKoylu({
				Guild: message.guild.id,
				ID: 1,
				Lobby: [{
					ID: 1,
					Channel: message.member.voice.channel.id,
					Author: message.author.id,
					Date: Date.now(),
					Type: true
				}],
				Oyun: Array,
			})
			newData.save().then(async veri => {
				let data = await veri.Lobby
				data.reverse();
				await message.channel.send(`**#${data[0].ID}** numaralı **Vampir Köylü** oyunu **${moment(data[0].Date).locale("tr").format("LLL")}** tarihinde <@${data[0].Author}> (\`${data[0].Author}\`) tarafından başlatıldı!`)

			})
		} else {
			let veri = data.Lobby;
			if (veri.map(x => x.Channel).some(kanal => kanal === message.member.voice.channel.id) && veri.map(x => x.Type).some(durum => durum === true)) return message.reply("Bu kanalda zaten bir lobi oluşturulmuş lütfen oyunu bitirin veya başlatınız!")
			await data.Lobby.push({
				ID: data.ID + 1,
				Channel: message.member.voice.channel.id,
				Author: message.author.id,
				Date: Date.now(),
				Type: true
			});
			data.ID += 1
			await data.save().then(async veri => {
				let data = await veri.Lobby
				data.reverse();
				await message.channel.send(`**#${data[0].ID}** numaralı **Vampir Köylü** oyunu **${moment(data[0].Date).locale("tr").format("LLL")}** tarihinde <@${data[0].Author}> (\`${data[0].Author}\`) tarafından başlatıldı!`)
			});

		}
	});










}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["vkbasla", "vkbaşla"],
	permLevel: 0,
}

exports.help = {
	name: 'vkstart',
	description: 'Vampir köylü oyununu başlatmaya yaramaktadır',
	usage: 'vkroller',
	kategori: 'Vampir Koylu'
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function capitalize(s) {
	let x = s.toLowerCase();
	if (typeof x !== 'string') return ''
	return x.charAt(0).toUpperCase() + x.slice(1)
}

function lengthByArray(arr, result = {}) {
	arr.forEach(e => result[e] ? result[e]++ : result[e] = 1);
	return result;
}