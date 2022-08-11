const {MessageEmbed} = require("discord.js");
const Discord = require('discord.js');
const client = global.client = new Discord.Client({fetchAllMembers: true});
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
moment.locale("tr");
const Stat = require("./models/stats");
const logs = require('discord-logs');
logs(client);
let StaffXP = require("./models/stafxp");
let mainSettings = require(__dirname+"/../settings.js");
let mongoose = require("mongoose");
mongoose.connect(mainSettings.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.db = require("./models/özelperm");
const sunucuayar = require('./models/sunucuayar');
let randMiss = require("./models/randomMission");
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
  "CEZA_PUAN_KANAL": mainSettings.CEZA_PUAN_KANAL,
  "vkyonetici": "",
}

const conf = client.ayarlar
global.conf = conf;
client.kullanabilir = function (id) {
  if (client.guilds.cache.get(mainSettings.sunucuId).members.cache.get(id).hasPermission("ADMINISTRATOR") || client.guilds.cache.get(mainSettings.sunucuId).members.cache.get(id).hasPermission("MANAGE_CHANNELS")) return true;
  return false;
};

const RLSchema = mongoose.Schema({
  Id: { type: String, default: null },
  Logs: { type: Array, default: [] }
});
const RLModel = mongoose.model('RolLogs', RLSchema);

client.on("guildMemberRoleRemove", async (member, role) => {
  const Log = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
  if (!Log || !Log.executor || Log.executor.bot || Log.createdTimestamp < (Date.now() - 5000)) return;
  const Data = await RLModel.findOne({ Id: member.id }) || new RLModel({ Id: member.id });
  Data.Logs.push({
    Date: Date.now(),
    Type: "[KALDIRMA]",
    Executor: Log.executor.id,
    Role: role.id
  });
  Data.save();
});

client.on("guildMemberRoleAdd", async (member, role) => {
  const Log = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
  if (!Log || !Log.executor || Log.executor.bot || Log.createdTimestamp < (Date.now() - 5000)) return;
  const Data = await RLModel.findOne({ Id: member.id }) || new RLModel({ Id: member.id });
  Data.Logs.push({
    Date: Date.now(),
    Type: "[EKLEME]",
    Executor: Log.executor.id,
    Role: role.id
  });
  Data.save()
});
let Database = require("./models/invite");
const guildInvites = new Map();
client.on("ready", async () => {
  client.guilds.cache.forEach(guild => {
    guild.fetchInvites().then(invites => guildInvites.set(guild.id, invites)).catch(err => console.log(err));
  });
}); 

client.on("inviteCreate", async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("inviteDelete", invite => setTimeout(async () => { guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()); }, 5000));

client.on("guildMemberAdd", async member => {
  let inviteChannelID = await sunucuayar.findOne({}).then(x => x.INVITEChannel);
  let cachedInvites = guildInvites.get(member.guild.id);
  let newInvites = await member.guild.fetchInvites();
  let usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => !newInvites.has(inv.code)) || {code: member.guild.vanityURLCode, uses: null, inviter: {id: null}};
  let inviter = client.users.cache.get(usedInvite.inviter.id) || {id: member.guild.id};
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
  let inviteChannel = client.channels.cache.get(inviteChannelID);

  Database.findOne({ guildID: member.guild.id, userID: member.id }, (err, joinedMember) => {
    if (!joinedMember) {
      let newJoinedMember = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: member.id,
          inviterID: inviter.id,
          regular: 0,
          bonus: 0,
          fake: 0
      });
      newJoinedMember.save();
    } else {
      joinedMember.inviterID = inviter.id;
      joinedMember.save();
    };
  });
  if (isMemberFake) {
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 0,
          bonus: 0,
          fake: 1
        });
        newInviter.save().then(x => {
          if (inviteChannel) inviteChannel.send( `${member} (\`${member.id}\`) Kullanıcısıyla beraber \`${member.guild.memberCount}\` Kişi Olduk. **Davet Eden: ${inviter === member.guild.id ? member.guild.name : inviter}** **Ulaştığı Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ⛔`).catch(err => { });
        });
      } else {
        inviterData.fake++
        inviterData.save().then(x => {
          if (inviteChannel) inviteChannel.send( `${member} (\`${member.id}\`) Kullanıcısıyla beraber \`${member.guild.memberCount}\` Kişi Olduk. **Davet Eden: ${inviter === member.guild.id ? member.guild.name : inviter}** **Ulaştığı Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ⛔`).catch(err => { });
        });
      };
    });
  } else {
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
        if (!inviterData) {
          let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 1,
            bonus: 0,
            fake: 0
          });
          newInviter.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${member}  (\`${member.id}\`) Kullanıcısıyla beraber \`${member.guild.memberCount}\` Kişi Olduk. **Davet Eden: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag}** **Ulaştığı Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ☑️`).catch(err => { });
          });
        } else {
          client.dailyMission(inviter.id, "davet", 1)
          aaddAudit(inviter.id, 1)
          inviterData.regular++;
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send( `${member}  (\`${member.id}\`) Kullanıcısıyla beraber \`${member.guild.memberCount}\` Kişi Olduk. **Davet Eden: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag}** **Ulaştığı Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ☑️`).catch(err => { });
          });
        };
      });
  };
  guildInvites.set(member.guild.id, newInvites);
});

client.on("guildMemberRemove", async member => {
  let inviteChannelID = await sunucuayar.findOne({}).then(x => x.INVITEChannel);
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
  let inviteChannel = client.channels.cache.get(inviteChannelID);
  Database.findOne({ guildID: member.guild.id, userID: member.id }, async (err, memberData) => {
    if (memberData && memberData.inviterID) {
      let inviter = client.users.cache.get(memberData.inviterID) || {id: member.guild.id};
      Database.findOne({ guildID: member.guild.id, userID: memberData.inviterID }, async (err, inviterData) => {
        if (!inviterData) {
         let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 0,
            bonus: 0,
            fake: 0
          });
          newInviter.save();
        } else {
          if (isMemberFake) {
            if (inviterData.fake-1 >= 0) inviterData.fake--;
          } else {
            if (inviterData.regular-1 >= 0) inviterData.regular--;
          };
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send( `${member}  (\`${member.id}\`) Kullanıcısıyla Beraber \`${member.guild.memberCount}\` Kişi Kaldık. **Davet Eden: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} ** **Kalan Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ♿`).catch(err => { });
          });
        };
      });
    } else {
      if (inviteChannel) inviteChannel.send( `**${member.user.tag}** Sunucudan ayrıldı! Davetçi bulunamadı!`).catch(err => { });
    };
  });
});

client.on("message", async (message) => {
  let args = message.content.split(' ').slice(1);
  let prefix = "!"
  let command = message.content.split(' ')[0].slice(prefix.length);
  if (command === 'rollog' || command === 'rol-log') {
    if (!client.kullanabilir(message.author.id) && !mainSettings.commandChannel.includes(message.channel.name)) return 
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return  message.channel.send(`${message.author}, lütfen bir üye belirt.`);
    const data = await RLModel.findOne({ Id: user.id });
    let embed = new MessageEmbed().setAuthor(user.tag, user.displayAvatarURL({ dynamic: true })).setTimestamp();
    const liste = data ? data.Logs.map((res) => `\`[${moment(res.Date).format("DD/MM hh:mm")}, ${res.Type}]\` <@${res.Executor}>: <@&${res.Role}>`).reverse() : "Veri bulunamadı.";
    let page = 1;
    const msg = await message.channel.send(embed.setAuthor(user.tag, user.avatarURL({ dynamic: true })).setDescription(`${liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9)}`));

    if (liste.length > 9) {
      await msg.react("◀");
      await msg.react("▶");

      let collector = msg.createReactionCollector((react, user) => ["◀", "▶"].some(e => e == react.emoji.name) && user.id == message.member.id, { time: 200000 });

      collector.on("collect", async (react) => {
        await react.users.remove(message.author.id).catch(() => undefined);
        if (react.emoji.name == "▶") {
          if (liste.slice((page + 1) * 9 - 9, (page + 1) * 9).length <= 0) return;
          page += 1;
          let newList = liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9);
          msg.edit(embed.setAuthor(user.tag, user.avatarURL({ dynamic: true })).setDescription(`${newList}`));
        }
        if (react.emoji.name == "◀") {
          if (liste.slice((page - 1) * 9 - 9, (page - 1) * 9).length <= 0) return;
          page -= 1;
          let newList = liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9);
          msg.edit(embed.setAuthor(user.tag, user.avatarURL({ dynamic: true })).setDescription(`${newList}`));
        }
      });
    }
  }
  if (message.activity && message.activity.type === 3 && !message.deleted) {
    if (!client.kullanabilir(message.author.id) && !mainSettings.commandChannel.includes(message.channel.name)) message.delete(), message.channel.send(`${message.author}, Bu sunucuda chate spotify linki atmak yasaktır.`).then(x => x.delete({ timeout: 7500 }))

  }
});


client.login(mainSettings.EXECUTIVE).catch(err => console.log("Token bozulmuş lütfen yeni bir token girmeyi dene"));

client.emoji = function(x) {
  return client.emojis.cache.find(x => x.name === client.emojiler[x]);
};
const emoji = global.emoji;

const sayiEmojiler = {
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
  9: ""
};

client.emojiSayi = function(sayi) {
  var yeniMetin = "";
  var arr = Array.from(sayi);
  for (var x = 0; x < arr.length; x++) {
    yeniMetin += (sayiEmojiler[arr[x]] === "" ? arr[x] : sayiEmojiler[arr[x]]);
  }
  return yeniMetin;
};

client.emojiler = {
  onay: "schawn_tik",
  iptal: "schawn_iptal",
  cevrimici: "schawn_online",
  rahatsizetmeyin: "schawn_dnd",
  bosta: "schawn_away",
  gorunmez: "schawn_offline",
  erkekEmoji: "schawn_man",
  kizEmoji: "schawn_woman",
  sagEmoji: "schawn_sag",
  tikEmoji: "schawn_tik",
  aktifEmoji: "schawn_acik",
  deaktifEmoji: "schawn_kapali",
  muteEmoji: "schawn_muted",
  unmuteEmoji: "schawn_unmuted",
  deafnedEmoji: "schawn_deafned",
  undeafnedEmoji: "schawn_undeafned"
};

global.emoji = client.emoji = function(x) {
  return client.emojis.cache.find(x => x.name === client.emojiler[x]);
};

client.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


client.renk = {
  //"renksiz": "2F3136", // 0x36393E
  "mor": "#3c0149",
  "mavi": "#10033d",
  "turkuaz": "#00ffcb",
  "kirmizi": "#750b0c",
  "yesil": "#032221"// 00cd00 - 008b00
};

client.randomColor = function () {
  return client.renk[Object.keys(client.renk).random()];
};

let kufurler = ["allahoc","allahoç","allahamk","allahaq","0r0spuc0cu","4n4n1 sk3r1m","p1c","@n@nı skrm","evladi","orsb","orsbcogu","amnskm","anaskm","oc","abaza","abazan","ag","a\u011fz\u0131na s\u0131\u00e7ay\u0131m","fuck","shit","ahmak","seks","sex","allahs\u0131z","amar\u0131m","ambiti","am biti","amc\u0131\u011f\u0131","amc\u0131\u011f\u0131n","amc\u0131\u011f\u0131n\u0131","amc\u0131\u011f\u0131n\u0131z\u0131","amc\u0131k","amc\u0131k ho\u015faf\u0131","amc\u0131klama","amc\u0131kland\u0131","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","am\u0131k","am\u0131na","amına","am\u0131nako","am\u0131na koy","am\u0131na koyar\u0131m","am\u0131na koyay\u0131m","am\u0131nakoyim","am\u0131na koyyim","am\u0131na s","am\u0131na sikem","am\u0131na sokam","am\u0131n feryad\u0131","am\u0131n\u0131","am\u0131n\u0131 s","am\u0131n oglu","am\u0131no\u011flu","am\u0131n o\u011flu","am\u0131s\u0131na","am\u0131s\u0131n\u0131","amina","amina g","amina k","aminako","aminakoyarim","amina koyarim","amina koyay\u0131m","amina koyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","amin oglu","amiyum","amk","amkafa","amk \u00e7ocu\u011fu","amlarnzn","aml\u0131","amm","ammak","ammna","amn","amna","amnda","amndaki","amngtn","amnn","amona","amq","ams\u0131z","amsiz","amsz","amteri","amugaa","amu\u011fa","amuna","ana","anaaann","anal","analarn","anam","anamla","anan","anana","anandan","anan\u0131","anan\u0131","anan\u0131n","anan\u0131n am","anan\u0131n am\u0131","anan\u0131n d\u00f6l\u00fc","anan\u0131nki","anan\u0131sikerim","anan\u0131 sikerim","anan\u0131sikeyim","anan\u0131 sikeyim","anan\u0131z\u0131n","anan\u0131z\u0131n am","anani","ananin","ananisikerim","anani sikerim","ananisikeyim","anani sikeyim","anann","ananz","anas","anas\u0131n\u0131","anas\u0131n\u0131n am","anas\u0131 orospu","anasi","anasinin","anay","anayin","angut","anneni","annenin","annesiz","anuna","aq","a.q","a.q.","aq.","ass","atkafas\u0131","atm\u0131k","att\u0131rd\u0131\u011f\u0131m","attrrm","auzlu","avrat","ayklarmalrmsikerim","azd\u0131m","azd\u0131r","azd\u0131r\u0131c\u0131","babaannesi ka\u015far","baban\u0131","baban\u0131n","babani","babas\u0131 pezevenk","baca\u011f\u0131na s\u0131\u00e7ay\u0131m","bac\u0131na","bac\u0131n\u0131","bac\u0131n\u0131n","bacini","bacn","bacndan","bacy","bastard","b\u0131z\u0131r","bitch","biting","boner","bosalmak","bo\u015falmak","cenabet","cibiliyetsiz","cibilliyetini","cibilliyetsiz","cif","cikar","cim","\u00e7\u00fck","dalaks\u0131z","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domald\u0131","domald\u0131n","domal\u0131k","domal\u0131yor","domalmak","domalm\u0131\u015f","domals\u0131n","domalt","domaltarak","domalt\u0131p","domalt\u0131r","domalt\u0131r\u0131m","domaltip","domaltmak","d\u00f6l\u00fc","d\u00f6nek","d\u00fcd\u00fck","eben","ebeni","ebenin","ebeninki","ebleh","ecdad\u0131n\u0131","ecdadini","embesil","emi","fahise","fahi\u015fe","feri\u015ftah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","giberim","giberler","gibis","gibi\u015f","gibmek","gibtiler","goddamn","godo\u015f","godumun","gotelek","gotlalesi","gotlu","gotten","gotundeki","gotunden","gotune","gotunu","gotveren","goyiim","goyum","goyuyim","goyyim","g\u00f6t","g\u00f6t deli\u011fi","g\u00f6telek","g\u00f6t herif","g\u00f6tlalesi","g\u00f6tlek","g\u00f6to\u011flan\u0131","g\u00f6t o\u011flan\u0131","g\u00f6to\u015f","g\u00f6tten","g\u00f6t\u00fc","g\u00f6t\u00fcn","g\u00f6t\u00fcne","g\u00f6t\u00fcnekoyim","g\u00f6t\u00fcne koyim","g\u00f6t\u00fcn\u00fc","g\u00f6tveren","g\u00f6t veren","g\u00f6t verir","gtelek","gtn","gtnde","gtnden","gtne","gtten","gtveren","hasiktir","hassikome","hassiktir","has siktir","hassittir","haysiyetsiz","hayvan herif","ho\u015faf\u0131","h\u00f6d\u00fck","hsktr","huur","\u0131bnel\u0131k","ibina","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnerator","ibnesi","idiot","idiyot","imansz","ipne","iserim","i\u015ferim","ito\u011flu it","kafam girsin","kafas\u0131z","kafasiz","kahpe","kahpenin","kahpenin feryad\u0131","kaka","kaltak","kanc\u0131k","kancik","kappe","karhane","ka\u015far","kavat","kavatn","kaypak","kayyum","kerane","kerhane","kerhanelerde","kevase","keva\u015fe","kevvase","koca g\u00f6t","kodu\u011fmun","kodu\u011fmunun","kodumun","kodumunun","koduumun","koyarm","koyay\u0131m","koyiim","koyiiym","koyim","koyum","koyyim","krar","kukudaym","laciye boyad\u0131m","libo\u015f","madafaka","malafat","malak","mcik","meme","memelerini","mezveleli","minaamc\u0131k","mincikliyim","mna","monakkoluyum","motherfucker","mudik","oc","ocuu","ocuun","O\u00c7","o\u00e7","o. \u00e7ocu\u011fu","o\u011flan","o\u011flanc\u0131","o\u011flu it","orosbucocuu","orospu","orospucocugu","orospu cocugu","orospu \u00e7oc","orospu\u00e7ocu\u011fu","orospu \u00e7ocu\u011fu","orospu \u00e7ocu\u011fudur","orospu \u00e7ocuklar\u0131","orospudur","orospular","orospunun","orospunun evlad\u0131","orospuydu","orospuyuz","orostoban","orostopol","orrospu","oruspu","oruspu\u00e7ocu\u011fu","oruspu \u00e7ocu\u011fu","osbir","ossurduum","ossurmak","ossuruk","osur","osurduu","osuruk","osururum","otuzbir","\u00f6k\u00fcz","\u00f6\u015fex","patlak zar","penis","pezevek","pezeven","pezeveng","pezevengi","pezevengin evlad\u0131","pezevenk","pezo","pic","pici","picler","pi\u00e7","pi\u00e7in o\u011flu","pi\u00e7 kurusu","pi\u00e7ler","pipi","pipi\u015f","pisliktir","porno","pussy","pu\u015ft","pu\u015fttur","rahminde","revizyonist","s1kerim","s1kerm","s1krm","sakso","saksofon","saxo","sekis","serefsiz","sevgi koyar\u0131m","sevi\u015felim","sexs","s\u0131\u00e7ar\u0131m","s\u0131\u00e7t\u0131\u011f\u0131m","s\u0131ecem","sicarsin","sie","sik","sikdi","sikdi\u011fim","sike","sikecem","sikem","siken","sikenin","siker","sikerim","sikerler","sikersin","sikertir","sikertmek","sikesen","sikesicenin","sikey","sikeydim","sikeyim","sikeym","siki","sikicem","sikici","sikien","sikienler","sikiiim","sikiiimmm","sikiim","sikiir","sikiirken","sikik","sikil","sikildiini","sikilesice","sikilmi","sikilmie","sikilmis","sikilmi\u015f","sikilsin","sikim","sikimde","sikimden","sikime","sikimi","sikimiin","sikimin","sikimle","sikimsonik","sikimtrak","sikin","sikinde","sikinden","sikine","sikini","sikip","sikis","sikisek","sikisen","sikish","sikismis","siki\u015f","siki\u015fen","siki\u015fme","sikitiin","sikiyim","sikiym","sikiyorum","sikkim","sikko","sikleri","sikleriii","sikli","sikm","sikmek","sikmem","sikmiler","sikmisligim","siksem","sikseydin","sikseyidin","siksin","siksinbaya","siksinler","siksiz","siksok","siksz","sikt","sikti","siktigimin","siktigiminin","sikti\u011fim","sikti\u011fimin","sikti\u011fiminin","siktii","siktiim","siktiimin","siktiiminin","siktiler","siktim","siktim","siktimin","siktiminin","siktir","siktir et","siktirgit","siktir git","siktirir","siktiririm","siktiriyor","siktir lan","siktirolgit","siktir ol git","sittimin","sittir","skcem","skecem","skem","sker","skerim","skerm","skeyim","skiim","skik","skim","skime","skmek","sksin","sksn","sksz","sktiimin","sktrr","skyim","slaleni","sokam","sokar\u0131m","sokarim","sokarm","sokarmkoduumun","sokay\u0131m","sokaym","sokiim","soktu\u011fumunun","sokuk","sokum","soku\u015f","sokuyum","soxum","sulaleni","s\u00fclaleni","s\u00fclalenizi","s\u00fcrt\u00fck","\u015ferefsiz","\u015f\u0131ll\u0131k","taaklarn","taaklarna","tarrakimin","tasak","tassak","ta\u015fak","ta\u015f\u015fak","tipini s.k","tipinizi s.keyim","tiyniyat","toplarm","topsun","toto\u015f","vajina","vajinan\u0131","veled","veledizina","veled i zina","verdiimin","weled","weledizina","whore","xikeyim","yaaraaa","yalama","yalar\u0131m","yalarun","yaraaam","yarak","yaraks\u0131z","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraam\u0131","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarra\u011f","yarra\u011f\u0131m","yarra\u011f\u0131m\u0131","yarraimin","yarrak","yarram","yarramin","yarraminba\u015f\u0131","yarramn","yarran","yarrana","yarrrak","yavak","yav\u015f","yav\u015fak","yav\u015fakt\u0131r","yavu\u015fak","y\u0131l\u0131\u015f\u0131k","yilisik","yogurtlayam","yo\u011furtlayam","yrrak","z\u0131kk\u0131m\u0131m","zibidi","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiiin","ziksiin","zulliyetini","zviyetini"];
client.chatKoruma = async mesajIcerik => {
  if (!mesajIcerik) return;
    let inv = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;  
    if (inv.test(mesajIcerik)) return true;

    let link = /(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;  
    if (link.test(mesajIcerik)) return true;

    if ((kufurler).some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(mesajIcerik))) return true;
  return false;
};

client.splitEmbedWithDesc = async function(description, author = false, footer = false, features = false) {
  let embedSize = parseInt(`${description.length/2048}`.split('.')[0])+1
  let embeds = new Array()
  for (var i = 0; i < embedSize; i++) {
    let desc = description.split("").splice(i*2048, (i+1)*2048)
    let x = new MessageEmbed().setDescription(desc.join(""))
    if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
    if (i == embedSize-1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
    if (i == embedSize-1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
    if (features) {
      let keys = Object.keys(features)
      keys.forEach(key => {
        if (key == "setTimestamp") return
        let value = features[key]
        if (i !== 0 && key == 'setColor') x[key](value[0])
        else if (i == 0) {
          if(value.length == 2) x[key](value[0], value[1])
          else x[key](value[0])
        }
      })
    }
    embeds.push(x)
  }
  return embeds
};

client.yolla = async function (mesaj, msg, kanal) {
  if (!mesaj || typeof mesaj !== "string") return
  const embd = new Discord.MessageEmbed()
    .setAuthor(msg.tag, msg.displayAvatarURL({
      dynamic: true
    }))
    .setColor("RANDOM")
    .setDescription(mesaj)
  kanal.send(embd).then(msg => {
      msg.delete({
        timeout: 15000
      })
    })
    .catch(console.error);
}

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dk.]');
};

client.wait = async function(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
};
Array.prototype.shuffle = function () {
  let i = this.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
};
Array.prototype.temizle = function() {
 let yeni = [];
  for (let i of this) {
   if (!yeni.includes(i)) yeni.push(i);
  }
  return yeni;
};

client.savePunishment = async () => {
  sunucuayar.findOne({}, async (err, res) => {
    if (!res) return
    res.WARNID = res.WARNID + 1
    res.save().catch(e => console.log(e))
  })
}

client.Embed = async (kanal, message) => {

  let embed = new MessageEmbed()
  .setColor("RANDOM")
  .setDescription(message)
  client.channels.cache.get(kanal).send(embed).then(x => x.delete({timeout: 5000}))
return embed
}
function aaddAudit(id, value) {
  Stat.updateMany({userID: id, guildID: client.ayarlar.sunucuId}, { $inc: { "yedi.Invite": value } }).exec((err, res) => {
    if(err) console.error(err);
  });
};


client.addAudit = function (id, value, Type) {
  if (Type == "Erkek") {
    Stat.updateOne({userID: id, guildID: client.ayarlar.sunucuId}, { $inc: { "yedi.Man": value,Man: value } }, {upsert: true}).exec();
  } else if (Type == "Kadin") {
    Stat.updateOne({userID: id, guildID: client.ayarlar.sunucuId}, { $inc: { "yedi.Woman": value,Woman: value } }, {upsert: true}).exec()
  } else return;
}

client.dailyMission = async function(userID, type, value) {

  randMiss.findOne({userID: userID}, async (err, data) => {
    if (!data) return;
    if (data.Mission.MISSION == type) {
      data.Check+= value;data.save()
    }
  })

}
