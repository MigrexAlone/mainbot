const mongoose = require('mongoose');
const Schema = new mongoose.Schema;


let yasaklitagData = Schema({
    Tag: String,
    GuildID: String,
    Members: Array,
    Date: Number
});

module.exports = mongoose.model("yasaklitag", yasaklitagData);