const client = global.client;
let conf = client.ayarlar
let teyit = require("../models/teyit");
let sunucuayar = require("../models/sunucuayar");
const message = require("../../Moderasyon/events/message");
module.exports = async member => {
  let data2 = await sunucuayar.findOne({})
  let unregister= data2.UNREGISTER;
  if (member.roles.cache.some(x => unregister.some(y => x == y))) return;
  await teyit.findOne({userID: member.id, guildID: member.guild.id}, async (err, data) => {
    if (!data) return;
  data.userName.push(`\`${member.displayName} \` (Sunucudan Ayrılma)`),data.save()
  })

};