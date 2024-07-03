const { ApiService } = require("./ApiService");
const { useQueue } = require("discord-player");
const { Logger } = require("../utilis/Logger.js");
const logger = Logger.getLogger()

let apiService = ApiService.getInstance(process.env.API_URL);
let previousStatus = null; 

async function pollStatus() {
    try {
        const currentStatus = await apiService.getStatus();
        const currentStatusMessage = currentStatus.message;
        if(currentStatusMessage.onVoiceChannel){

        if (currentStatusMessage && JSON.stringify(currentStatusMessage) !== JSON.stringify(previousStatus) && currentStatusMessage.onVoiceChannel) {
            if (previousStatus) {
                if (previousStatus.loopMode !== currentStatusMessage.loopMode) {
                    onPropertyChange(currentStatusMessage.guildId, 'LoopMode', previousStatus.loopMode, currentStatusMessage.loopMode);
                }
                if (previousStatus.volume !== currentStatusMessage.volume) {
                    onPropertyChange(currentStatusMessage.guildId, 'Volume', previousStatus.volume, currentStatusMessage.volume);
                }
                if (previousStatus.skipQueued !== currentStatusMessage.skipQueued) {
                    
                    onPropertyChange(currentStatusMessage.guildId, 'SkipQueued', previousStatus.skipQueued, currentStatusMessage.skipQueued);
                }
            }

        previousStatus = currentStatusMessage;
        setTimeout(pollStatus, 3000); 
        }
         else {
            logger.logInfo("No change");
            setTimeout(pollStatus, 3000); 
        }}
        else return;
    } catch (error) {
        logger.logError('There was an error: ', error.code);
        logger.logWarn("Bot will continue to work without API connection");
        apiService.connection = false;
        apiService.isPolling = false;
    } 
}

async function onPropertyChange(guildId, property, oldValue, newValue) {
    const queue = useQueue(guildId);
    switch (property) {
        case 'LoopMode':
            switch (newValue) {
                case 0:
                    queue.setRepeatMode(0);
                    logger.logInfo(`LoopMode: ${newValue}`);
                    break;
                case 1:
                    queue.setRepeatMode(1);
                    logger.logInfo(`LoopMode: ${newValue}`);
                    break;
                case 2:
                    queue.setRepeatMode(2);
                    logger.logInfo(`LoopMode: ${newValue}`);
                    break;
                default:
                    break;
            }
            break;
        case 'Volume':
            queue.node.setVolume(newValue);
            logger.logInfo(`Volume: ${newValue}`);
            break;
        case 'SkipQueued':
            if (newValue) {
                queue.node.skip();
                await apiService.setSkipQueued(false);
            }
            logger.logInfo(`SkipQueued: ${newValue}`);
            break;
        default:
            logger.logWarn(`cannot set property of name ${property}`);
    }
}

module.exports = {pollStatus};