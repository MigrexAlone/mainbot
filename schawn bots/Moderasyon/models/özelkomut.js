let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let data = Schema({
        guildID: String,
        komutAd: String,
        verilcekRol: Array,
        roller: Array,
        kisiler: Array,
        sorumluluk: Array,
        YetkiliROL: Boolean,
        YetkiliData: Array

        /*
        
        .pippin @etiket
        YetkiliROL: true,
        YetkiliData: {$inc: {["YetkiliData.target.yetki"]: verildi}}

        YetkiliData: {
                "ID": {
                        Id: Id
                        yetki: pippin,
                        verilenRol: ["",""],
                        Tarih: Date.now(),
                }
        }
        
        */
})

module.exports = mongoose.model("specialcommands", data);