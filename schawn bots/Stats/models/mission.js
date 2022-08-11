let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let missionSchema = Schema({
    RoleID: {type: String, default: ""},
    Type: {type: String, default: ""},
    Voice: {type: String, default: ""},
    Message: {type: String, default: ""},
    Members: {type: Array, default: []}
});

module.exports = mongoose.model("mission", missionSchema)