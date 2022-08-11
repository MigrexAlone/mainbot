const Discord = require("discord.js");
let Canvas = require("canvas")
exports.run = async (client, message, args, durum, kanal) => {
  if (!message.guild) return
  if (!client.ayarlar.sahip.some(x => x == message.author.id)) return

  if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
  let code = args.join(' ');
  function clean(text) {
    if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
    text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
    return text;
  };
  try {
    var evaled = clean(await eval(code));
    if (evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
    message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, { code: "js", split: true });
  } catch (err) { message.channel.send(err, { code: "js", split: true }) };

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['eval'],
  permLevel: 4
};

exports.help = {
  name: 'eval',
  description: "Sunucuda komut denemeye yarar",
  usage: 'eval <kod>',
  kategori: "Bot Yapımcısı"
};
