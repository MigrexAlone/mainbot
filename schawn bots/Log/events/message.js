module.exports = async message => {
  if (message.channel.type == "dm") return;
    if (message.author.bot) return

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
  if (cmd) {
    cmd.run(client, message, params);
  }
};