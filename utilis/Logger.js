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

    logInfo(text) {
        let now = new Date();
        let currentTime = now.toLocaleTimeString();
        console.log(`[${currentTime}] [Info]:  ${text}`);
    }
    logWarn(text) {
        let now = new Date();
        let currentTime = now.toLocaleTimeString();
        console.log(`[${currentTime}] [Warn]:  ${text}`);
    }
    logError(text) {
        let now = new Date();
        let currentTime = now.toLocaleTimeString();
        console.log(`[${currentTime}] [Error]:  ${text}`);
    }


}
module.exports = { Logger };