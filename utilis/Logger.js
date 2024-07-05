class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        Logger.instance = this;
    }

    static getLogger() {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    logInfo(text, guildId = "System") {
        let now = new Date();
        let currentTime = now.toLocaleTimeString();
        console.log(`[${currentTime}] [Info] [${guildId}]:  ${text}`);
    }
    logWarn(text,guildId = "System") {
        let now = new Date();
        let currentTime = now.toLocaleTimeString();
        console.log(`[${currentTime}] [Warn] [${guildId}]:  ${text}`);
    }
    logError(text,guildId = "System") {
        let now = new Date();
        let currentTime = now.toLocaleTimeString();
        console.log(`[${currentTime}] [Error] [${guildId}]:  ${text}`);
    }


}
module.exports = { Logger };