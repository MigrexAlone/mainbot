
const Sunucu_1 = "lucâsty.";
module.exports = {
    apps: [
        {
            name: `${Sunucu_1}-EXECUTIVE`,
            script: "./Executive/main.js",
            watch: false
        },
        {
            name: `${Sunucu_1}-STATS`,
            script: "./Stats/main.js",
            watch: false
        },
        {
            name: `${Sunucu_1}-MOD`,
            script: "./Moderasyon/main.js",
            watch: false
        },
		{
            name: `${Sunucu_1}-ASYNC`,
            script: "./Async/main.js",
            watch: true
        },
    {
           name: `${Sunucu_1}-LOG`,
            script: "./Log/main.js",
            watch: true
    },
    ]
};
