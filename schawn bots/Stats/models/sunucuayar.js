let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let serverSettings = Schema({
    guildID: {type: String, default: ""},
    WARNID: {type: Number, default: 0},
    TAG: {type: String, default: ""},
    TAG2: {type: String, default: ""},
    LINK: {type: String, default: ""},
    GKV: {type: Array, default: []},
    GRV: {type: Array, default: []},
    BAN_TAG: {type: Array, default: []},

    // Channel Settings


    CHAT: {type: String, default: ""},
    REGISTER: {type: String, default: ""},
    TAGLOG: {type: String, default: ""},
    RULES: {type: String, default: ""},
    SLEEP: {type: String, default: ""},
    PUBCategory: {type: Array, default: ""},

    // Roles Settings

    VKAuthor: {type: String, default: ""},
    UNREGISTER: {type: Array, default: []},
    MAN: {type: Array, default: []},
    WOMAN: {type: Array, default: []},
    TEAM: {type: String, default: ""},
    BOOST: {type: String, default: ""},
    JAIL: {type: String, default: ""},
    REKLAM: {type: String, default: ""},
    SUPHELI: {type: String, default: ""},
    BANTAG: {type: String, default: ""},
    MUTED: {type: String, default: ""},
    VMUTED: {type: String, default: ""},

    // Author Roles Settings

    MUTEAuthorized: {type: Array, default: []},
    VMUTEAuthorized: {type: Array, default: []},
    JAILAuthorized: {type: Array, default: []},
    REKLAMAuthorized: {type: Array, default: []},
    BANAuthorized: {type: Array, default: []},
    WARNAuthorized: {type: Array, default: []},
    REGISTERAuthorized: {type: Array, default: []},
    COMMANDAuthorized: {type: Array, default: []},
    EnAltYetkiliRol: {type: String, default: ""},
    UstYetkiliRol: {type: Array, default: []}, // 3 YETKİLİ ROL 
    Ust1YetkiliRol: {type: String, default: ""}, // 1. YETKİLİ ROL
    Ust2YetkiliRol: {type: String, default: ""}, // 2. YETKİLİ ROL
    Ust3YetkiliRol: {type: String, default: ""}, // 3. YETKİLİ ROL
    VKCEZALI: {type: String, default: ""},
    DCCEZALI: {type: String, default: ""},
    STCEZALI: {type: String, default: ""},

    // Limit System

    BANLimit: {type: Number, default: 0},
    JAILLimit: {type: Number, default: 0},
    REKLAMLimit: {type: Number, default: 0},
    MUTELimit: {type: Number, default: 0},
    VMuteLimit: {type: Number, default: 0},
    
    // Logging System

    INVITEChannel: {type: String, default: ""},

    MUTEChannel: {type: String, default: ""},
    VMUTEChannel: {type: String, default: ""},
    BANChannel: {type: String, default: ""},
    JAILChannel: {type: String, default: ""},
    WARNChannel: {type: String, default: ""},
    REKLAMChannel: {type: String, default: ""},

    REGISTERChannel: {type: String, default: ""},
    NAMEChannel: {type: String, default: ""},
    CHATChannel: {type: String, default: ""},
    ROLEChannel: {type: String, default: ""},
    PINGChannel: {type: String, default: ""},
    COMMANDChannel: {type: String, default: ""},
    VOICEChannel: {type: String, default: ""},
    LEVELChannel: {type: String, default: ""},
    GUARDChannel: {type: String, default: ""}
})

module.exports = mongoose.model("setup", serverSettings);