module.exports = async message => {
  if (!message.guild) return
  if (message.author.bot) return;
  let client = message.client;
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
      cmd.run(client, message, params, durum, kanal);
  }
};
