const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const voiceStatsSchema = Schema({
  Guild: {type: String, default: ""},
  User: {type: String, default: ""},
  Day: {type: Number, default: 0},
  Channel: Map,

  Total: {type: Number, default: 0}
});

module.exports = mongoose.model("voice_stats", voiceStatsSchema);