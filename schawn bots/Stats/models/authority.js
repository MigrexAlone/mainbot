let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let authoritySchema = Schema({
    YetkiAdi: {type: String, default: ""}, 
    Roller: {type: Array, default: []}, 
    YetkiliRol: {type: Array, default: []} 
})

module.exports = mongoose.model("authority", authoritySchema)