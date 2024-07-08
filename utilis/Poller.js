const { ApiService } = require("./ApiService.js");
const { useQueue } = require("discord-player");
const { Logger } = require("./Logger.js");
const logger = Logger.getLogger()

let apiService = ApiService.getInstance(process.env.API_URL);
class Poller {
    previousStatus = null;
    static instances = {};
    guildId = "";
    isPolling = false;
    constructor(guildId) {
        this.guildId = guildId
    }
    static getInstance(guildId) {
        if (!Poller.instances[guildId]) {
            Poller.instances[guildId] = new Poller(guildId);  
        }
        return Poller.instances[guildId];
    }
    async pollStatus() {
        try {
            this.isPolling = true;
            const currentStatus = await apiService.getStatus(this.guildId);
            const currentStatusMessage = currentStatus.message;
            
            if (currentStatusMessage.onVoiceChannel) {

                if (currentStatusMessage && JSON.stringify(currentStatusMessage) !== JSON.stringify(this.previousStatus) && currentStatusMessage.onVoiceChannel) {
                    if (this.previousStatus) {
                        if (this.previousStatus.loopMode !== currentStatusMessage.loopMode) {
                            this.onPropertyChange(currentStatusMessage.guildId, 'LoopMode', this.previousStatus.loopMode, currentStatusMessage.loopMode);
                        }
                        if (this.previousStatus.volume !== currentStatusMessage.volume) {
                            this.onPropertyChange(currentStatusMessage.guildId, 'Volume', this.previousStatus.volume, currentStatusMessage.volume);
                        }
                        if (this.previousStatus.skipQueued !== currentStatusMessage.skipQueued) {

                            this.onPropertyChange(currentStatusMessage.guildId, 'SkipQueued', this.previousStatus.skipQueued, currentStatusMessage.skipQueued);
                        }
                    }

                    this.previousStatus = currentStatusMessage;
                    setTimeout(() => this.pollStatus(), 3000);
                }
                else {
                    logger.logInfo("No change", this.guildId);
                    setTimeout(() => this.pollStatus(), 3000);
                }
            }
            else {
                delete Poller.instances[this.guildId];
                this.isPolling = false;
                return;
            }

        } catch (error) {
            logger.logError(`There was an error: ${error}` );
            logger.logWarn("Bot will continue to work without API connection");
            apiService.connection = false;
            delete Poller.instances[this.guildId];
            this.isPolling = false;
        }
    }

    async onPropertyChange(guildId, property, oldValue, newValue) {
        const queue = useQueue(this.guildId);
        switch (property) {
            case 'LoopMode':
                switch (newValue) {
                    case 0:
                        queue.setRepeatMode(0);
                        logger.logInfo(`LoopMode: ${newValue}`, this.guildId);
                        break;
                    case 1:
                        queue.setRepeatMode(1);
                        logger.logInfo(`LoopMode: ${newValue}`, this.guildId);
                        break;
                    case 2:
                        queue.setRepeatMode(2);
                        logger.logInfo(`LoopMode: ${newValue}`, this.guildId);
                        break;
                    default:
                        break;
                }
                break;
            case 'Volume':
                queue.node.setVolume(newValue);
                logger.logInfo(`Volume: ${newValue}`, this.guildId);
                break;
            case 'SkipQueued':
                if (newValue) {
                    queue.node.skip();
                    await apiService.setSkipQueued(false, this.guildId);
                }
                logger.logInfo(`SkipQueued: ${newValue}`, this.guildId);
                break;
            default:
                logger.logWarn(`cannot set property of name ${property}`, this.guildId);
        }
    }
}
module.exports = { Poller };