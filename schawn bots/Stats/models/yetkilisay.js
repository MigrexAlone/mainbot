let mongoose = require("mongoose");

let yetkilisayDB = mongoose.Schema({
    userID: String,
    Amount: Number,
    Info: Object
});

module.exports = mongoose.model("yetkilisay", yetkilisayDB);