const { MessageEmbed } = require("discord.js");
let sunucuayar = require("../models/sunucuayar");
module.exports = async message => {
  if (message.author.bot) return;
  let client = message.client;
  if (message.channel.type == "dm") {
    return
    let data = await sunucuayar.findOne({guildID: client.ayarlar.sunucuId});
    let member = client.guilds.cache.get(client.ayarlar.sunucuId).members.cache.get(message.author.id)
    if (!message.author.username.includes(data.TAG)) return message.reply("Yetkili başvurusu yapabilmek için öncelikle sunucu tagını ismine almalısın!\n"+data.TAG).then(x => x.delete({timeout: 15000}));
    let sorular = [
        "İsim Yaş",
        "Kendini kısaca tanıt.",
        "Neden yetkili olmak istiyorsun?",
        "Yetkililik tecrüben var mı?",
        "Neden bu sunucu?",
        "Yetkili olursan bize nasıl katkın olabilir?"
    ];
    let cevaplar = message.content.join(" ").split(" - ");
    if (!cevaplar[0] || cevaplar.length != sorular.length) return message.reply(`Soruları doğru doldurmalısın! (Aralarına - koymalısın! Örn: \`Ahmet 18 - Xle ilgileniyorum.\`)\nSorular: ${sorular.join("\n")}`).then(x => x.delete({timeout: 15000}));
    let basvuruEmbed = new MessageEmbed().setColor("GREEN").setFooter("Başvuruya bakıldıktan sonra lütfen mesajın altına tik bırakınız.").setTimestamp().setAuthor(`${message.author.tag} (\`${message.author.id}\`)`, message.author.avatarURL({dynamic: true})).setDescription(`${message.author} üyesinin yetkili başvurusu;`);
    for (let i = 0; i < sorular.length; i++) {
        basvuruEmbed.addField(sorular[i], cevaplar[i]);
    };
    client.channels.cache.get(client.ayarlar.basvuruLog).send(basvuruEmbed);
  } else {
    const prefixes = client.ayarlar.prefix;
    const prefix = prefixes.filter(p => message.content.startsWith(p))[0];
    if (!prefix) return
      let command = message.content.split(" ")[0].slice(prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
      cmd = client.commands.get(command);
  
    } else if (client.aliases.has(command)) {
      cmd = client.commands.get(client.aliases.get(command));
  
    }
      let arr = cmd ? cmd.conf.aliases : [];
      cmd ? arr.push(cmd.help.name) : arr = ["yok"]
      let data = await client.db.find({guildID: message.guild.id})
      let veri = data.find(veri => arr.includes(veri.komutAd)) || {komutAd: "yok", kisiler: [], roller: []}
      let durum = veri.kisiler.includes(message.member.id) || message.member.roles.cache.some(rol => veri.roller.includes(rol.id)) || client.ayarlar.sahip.includes(message.author.id) || message.author.id == message.guild.owner.id
      let kanal = !client.ayarlar.commandChannel.includes(message.channel.name) && !message.member.permissions.has("ADMINISTRATOR") && !message.member.permissions.has("MANAGE_CHANNELS");
          if (cmd) {
        cmd.run(client, message, params, durum,kanal);
    }
  }
};

