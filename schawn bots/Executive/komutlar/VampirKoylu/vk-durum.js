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
			let lobi = data.filter(veri => veri.Channel === message.member.voice.channel.id && veri.Type === true);
			let oyun = data2.filter(veri => veri.Channel === message.member.voice.channel.id && veri.Durum === true)

			let ID = veri.ID

			let roller = data2.filter(x => data.map(x => x.Channel).some(kanal => kanal === message.member.voice.channel.id) && x.Durum === true).map(x => x.Liste)[0]
			let kazananlar = data2.filter(x => data.map(x => x.Channel).some(kanal => kanal === message.member.voice.channel.id) && x.Durum === true).map(x => x.Yasayanlar)[0]
			kazananlar = Object.keys(kazananlar)

			shuffle(kazananlar)

			let oluler = data2.filter(x => data.map(x => x.Channel).some(kanal => kanal === message.member.voice.channel.id) && x.Durum === true).map(x => x.Oluler)[0]


			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setColor('RANDOM')
				.setFooter(client.ayarlar.footer)
				.setDescription(`
\`#${ID}\` ID'li oyun için bilgiler:
─────────────────────
**• Gün:** \`${oyun[0].Gun}. Gün\`
**• Oyun Yöneticisi:** ${authorID.map(x => `<@${x}>`)}
**• Oyun Durumu:** \`${oyun[0].Zaman}\`
**• Oyun Başlatılma:** (\`${moment(lobi.Date).locale("tr").format("LLL")}\`)
**• Başlatılan Oyuncu Sayısı:** \`${Object.keys(roller).length} Kişi.\`
─────────────────────
**• Hayattaki Oyuncular:** (\`${kazananlar.length}\`)
${kazananlar.map(x => `<@${x}>`).length < 60 ? kazananlar.map(x => `<@${x}>`).join("\n") : "Katılımcı sayısı fazla olduğundan dolayı durum listelenemedi"}
─────────────────────
**• Ölü Oyuncular:** (\`${Object.keys(oluler).length}\`)
${Object.keys(oluler).map(x => `<@${x}> (\`${oluler[x]}\`)`).join("\n")}
─────────────────────
`)
			return message.channel.send(embed)
		}
		if (!data.map(x => x.Channel).some(kanal => kanal === message.member.voice.channel.id)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`Oyunu başlatmak için bir lobi oluşturmalısınız! (\`${prefix}vkstart\`)`))
		return message.reply("Lütfen bir lobi oluşturunuz")
	})
}
exports.conf = {aliases: []}
exports.help = {name: 'vkdurum'}
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}