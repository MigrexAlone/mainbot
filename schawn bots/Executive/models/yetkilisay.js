let mongoose = require("mongoose");

let yetkilisayDB = mongoose.Schema({
    userID: String,
    Tarih: Number,
});

module.exports = mongoose.model("yetkilisay", yetkilisayDB);