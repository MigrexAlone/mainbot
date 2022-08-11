let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let authority_user_Schema = Schema({
    Yetkili: {type: String, default: ""}, 
    VerilenRoller: {type: Array, default: []}, 
    RolAd: {type: String, default: ""} ,
    VerilenUye: {type: String, default: ""}
})

module.exports = mongoose.model("authority_user", authority_user_Schema)