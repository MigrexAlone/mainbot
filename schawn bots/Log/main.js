const {MessageEmbed} = require("discord.js");
const Discord = require('discord.js');
const client = global.client = new Discord.Client({fetchAllMembers: true});
const logs = require('discord-logs');
logs(client);
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
let mainSettings = require(__dirname + "/../settings.js");
let mongoose = require("mongoose");
mongoose.connect(mainSettings.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
moment.locale("tr");
require('./util/eventLoader')(client);

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir(__dirname+'/komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir(__dirname+"/komutlar/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./komutlar/${f}/` + file);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
      })
    })
  });
});

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-.]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
client.ayarlar = {
  "prefix": mainSettings.prefix,
  "botSesID": mainSettings.botSesID,
  "sunucuId": mainSettings.sunucuId,
    "sahip": mainSettings.sahip,
  "commandChannel": mainSettings.commandChannel,
    "basvuruLog": mainSettings.basvuruLog,
  "sorunCozucu": mainSettings.sorunCozucu,
  "terapist": mainSettings.terapist,
    "footer": mainSettings.footer,
  "onsekizatilacakoda": mainSettings.onsekizatilacakoda,
  "onsekizodalar": mainSettings.onsekizodalar,
  "readyFooter": mainSettings.readyFooter,
  "chatMesajı": mainSettings.chatMesajı,
  "YETKI_VER_LOG": mainSettings.YETKI_VER_LOG,
  "CEZA_PUAN_KANAL": mainSettings.CEZA_PUAN_KANAL
}
const conf = client.ayarlar
global.conf = conf;

client.on("guildMemberRoleAdd", async (member, role) => {
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} üyesine **${role.name}** rolü eklendi\n\n\`\`\`Rol: ${role.name} (${role.id})\nKullanıcı: ${member.user.tag} (${member.user.id})\nRol Eklenme: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)
    client.channels.cache.get(client.channels.cache.find(x => x.name == "rol_log").id).send(embed)
client.channels.cache.get(client.channels.cache.find(x => x.name == "rol_log_basit").id).send(`:key: ${member.user.tag} (\`${member.user.id}\`) üyesine \`${role.name}\` rolü eklendi.`)

});

client.on("guildMemberRoleRemove", async (member, role) => {

  let embed = new MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} üyesinin **${role.name}** rolü kaldırıldı\n\n\`\`\`Rol: ${role.name} (${role.id})\nKullanıcı: ${member.user.tag} (${member.user.id})\nRol Eklenme: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)
client.channels.cache.get(client.channels.cache.find(x => x.name == "rol_log").id).send(embed)
client.channels.cache.get(client.channels.cache.find(x => x.name == "rol_log_basit").id).send(`:wastebasket: ${member.user.tag} (\`${member.user.id}\`) üyesinden \`${role.name}\` rolü kaldırıldı.`)

});

client.on("guildMemberUpdate", async function (oldMember, newMember) {
  if (oldMember.displayName === newMember.displayName) return;

  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(newMember.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(newMember.user.tag, newMember.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${newMember} üyesinin sunucu içi ismi değiştirildi.

Nick Değişimi:
Önce: ${oldMember.displayName}
Sonra: ${newMember.displayName}

\`\`\`Kullanıcı: ${newMember.user.tag} (${newMember.user.id})\nDeğişim Tarihi: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)

  client.channels.cache.get(client.channels.cache.find(x => x.name == "nickname_log").id).send(embed)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "nickname_log_basit").id).send(`:file_folder: ${newMember.user.tag} (\`${newMember.user.id}\`) üyesinin sunucu içi ismi değişti \`${oldMember.displayName}\` **>** \`${newMember.displayName}\``).catch(() => {});
});

client.on("guildMemberAdd", async (member) => {
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} sunucuya katıldı.\n\nHesap Kurulma: ${moment(member.createdTimestamp).locale("tr").format("LLL")}\n\n\`\`\`Kullanıcı: ${member.user.tag} (${member.user.id})\nSunucuya Katılma: ${moment(member.joinedAt).locale("tr").format("LLL")}\`\`\``)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "join_leave_log").id).send(embed)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "join_leave_log_basit").id).send(`:inbox_tray: ${member.user.tag} (\`${member.id}\`) katıldı. \`${member.guild.memberCount}\` kişi olduk.`);
})
client.on("guildMemberRemove", async (member) => {
  let embed = new MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} sunucudan ayrıldı.\n\nHesap Kurulma: ${moment(member.createdTimestamp).locale("tr").format("LLL")}\n\n\`\`\`Kullanıcı: ${member.user.tag} (${member.user.id})\nSunucuya Katılma: ${moment(member.joinedAt).locale("tr").format("LLL")}\`\`\`\nSunucudan ayrıldığında ki rolleri:\n${member.roles.cache.filter(rol => rol.name != "@everyone").map(x => x).join(",")}`)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "join_leave_log").id).send(embed)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "join_leave_log_basit").id).send(`:outbox_tray: ${member.user.tag} (\`${member.id}\`) ayrıldı. \`${member.guild.memberCount}\` kişi olduk.`);
})
client.on("guildMemberUpdate", async (oldMember, newMember) => {

  // ROL EKLEME BASİT

})

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (client.channels.cache.find(x => x.name == "ses_log_basit")) {
    let oldChannel = oldState.channel;
    let newChannel = newState.channel;



    let logKanali = client.channels.cache.find(x => x.name == "ses_log_basit");
    let logKanali2 = client.channels.cache.find(x => x.name == "ses_log");
    let logKanali3 = client.channels.cache.find(x => x.name == "ses_mic_log");
    if (!oldState.channelID && newState.channelID) {
      let kanalGiris = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalına giriş yaptı.

Kanala Girdiği Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Girdiği Kanal: #${newChannel.name} (${newChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Girdiği Kanalda Bulunan Üyeler:
${newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)
      logKanali2.send(kanalGiris)
      return logKanali.send(`:telephone: ${newState.member.user.tag} (\`${newState.id}\`) üyesi **${newChannel.name}** kanalına giriş yaptı.`).catch(() => {});
    }



    if (oldState.channelID && !newState.channelID) {

      let kanalCikis = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${oldChannel}** kanalından ayrıldı.

Kanaldan Çıktığı Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Çıktığı Kanal: #${oldChannel.name} (${oldChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(oldChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Çıktığı Kanalda Bulunan Üyeler:
${oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)

      logKanali2.send(kanalCikis)
      return logKanali.send(`:telephone: ${newState.member.user.tag} (\`${newState.member.user.id}\`) üyesi **${oldChannel.name}** kanalından ayrıldı.`).catch(() => {});
    }

    if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) {
      let kanalDegisme = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${oldChannel}** kanalından **${newChannel}** kanalına geçiş yaptı.

Kanal Değiştirdiği Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Eski Kanal: #${oldChannel.name} (${oldChannel.id})\nYeni Kanal: #${newChannel.name} (${newChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Eski Kanalında Bulunan Üyeler:
${oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}

Yeni Kanalında Bulunan Üyeler:
${newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)
      logKanali2.send(kanalDegisme)
      return logKanali.send(`:telephone: ${newState.member.user.tag} üyesi **${oldChannel.name}** kanalından **${newChannel.name}** kanalına geçiş yaptı`).catch(() => {});
    }


    if (oldState.channelID && !oldState.selfDeaf && newState.selfDeaf) {
      let embed = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendini sağırlaştırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }

    if (oldState.channelID && oldState.selfDeaf && !newState.selfDeaf) {
      let embed = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendi sağırlaştırmasını kaldırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }

    if (oldState.channelID && oldState.selfMute && !newState.selfMute) {

      let embed = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında susturmasını kaldırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)

      return logKanali3.send(embed).catch(() => {});
    }
    if (oldState.channelID && !oldState.selfMute && newState.selfMute) {
      let embed = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendini susturdu.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }







  };
});


client.on("messageDelete", async (message) => {
  if (message.author.bot) return;
  let embed = new MessageEmbed()
    .setThumbnail(message.author.avatarURL({
      dynamic: true
    }))
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(conf.footer)
    .setAuthor(message.author.tag, message.author.avatarURL({
      dynamic: true
    }))
    .setDescription(`
${message.author} üyesi ${message.channel} kanalında mesajını sildi.

**__Silinen Mesaj:__**
${message.content.length > 0 ? message.content : "Silinen mesaj yoktur"}

**__Silinen Mesajdaki Resimler:__**
${ message.attachments.size > 0 ? message.attachments.filter(({ proxyURL }) => /\.(gif|jpe?g|png|webp)$/i.test(proxyURL)).map(({ proxyURL }) => proxyURL) : "Silinen resim yoktur"}

\`\`\`Kanal: #${message.channel.name} (${message.channel.id})\nKullanıcı: ${message.author.tag} (${message.author.id})\nMesaj ID: ${message.id}\nMesaj Atılma: ${moment(message.createdTimestamp).locale("tr").format("LLL")}\`\`\`
`)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "mesaj_silme_log").id).send(embed)
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot) return;
  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(conf.footer)
    .setAuthor(newMessage.author.tag, newMessage.author.avatarURL({
      dynamic: true
    }))
    .setDescription(`
${newMessage.author} üyesi ${newMessage.channel} kanalında bir mesajı düzenledi.

**__Düzenlenmeden Önce:__**
${oldMessage.content}
**__Düzenlendikten Sonra:__**
${newMessage.content}

\`\`\`Kanal: #${newMessage.channel.name} (${newMessage.channel.id})\nKullanıcı: ${newMessage.author.tag} (${newMessage.author.id})\nMesaj ID: ${newMessage.id}\nMesaj Atılma: ${moment(newMessage.createdTimestamp).locale("tr").format("LLL")}\`\`\`
`)
  client.channels.cache.get(client.channels.cache.find(x => x.name == "mesaj_edit_log").id).send(embed)
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  const prefixes = client.ayarlar.prefix;
  let prefix = prefixes.filter(p => message.content.startsWith(p))[0];
  if (!prefix) return;
  let yazilanKomut = message.content.split(" ")[0];
  yazilanKomut = yazilanKomut.slice(prefix.length);
  if (!yazilanKomut) return;
  client.channels.cache.get(client.channels.cache.find(x => x.name == "komut_log").id).send(`:wrench: **${message.author.tag}** (\`${message.author.id}\`) üyesi ${message.channel} kanalında bir komut kullandı: \`${prefix+yazilanKomut}\``)
})
client.login(mainSettings.LOG).catch(err => console.log("Token bozulmuş lütfen yeni bir token girmeyi dene"));