const mongoose = require("mongoose");

let uyarıData = mongoose.Schema({
    userID: String,
    Type: {
        type: Object,
        default: {
            "sesUyarı": 0,
            "UYARI": 0
        }
    }
});

module.exports = mongoose.model("uyarı", uyarıData);