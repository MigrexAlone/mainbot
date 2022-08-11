let alarmModel = require("../../models/alarm");

let ms = require("ms")
let moment = require("moment");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    let sure = args[0] ? ms(args[0]) : undefined;
    if (!sure) return message.channel.send("Geçerli bir süre belirtmelisin! (1s/1m/1h/1d)").then(x => x.delete({ timeout: 5000 }));
    if (!args[1]) return message.channel.send("Hatırlatmamı istediğin şeyi belirtmelisin!").then(x => x.delete({ timeout: 5000 }));
    let baslangic = Date.now();
    let yeniAlarm = new alarmModel({
      uye: message.author.id,
      kanal: message.channel.id,
      baslangic: baslangic,
      bitis: baslangic + sure,
      aciklama: args.slice(1).join(" ")
    });
    yeniAlarm.save();
    message.channel.send("Alarım Kuruldu.").then(x => x.delete({ timeout: 10000 }));


}
exports.conf = {aliases: ["alarm"]}
exports.help = {name: 'Alarm'}
