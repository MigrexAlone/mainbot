const reqEvent = (event) => require(`../events/${event}`);
module.exports = client => {
  client.on('ready', () => reqEvent('ready')(client));
  client.on('message', reqEvent('message'));
  client.on('userUpdate', reqEvent('userUpdate'));
  client.on('ready', () =>  reqEvent('checkPenals')(client));
  client.on('message', reqEvent('afk'));
};