const { ApiService } = require("./ApiService");
const { useQueue } = require("discord-player");

let apiService = ApiService.getInstance(process.env.API_URL);
let previousStatus = null; 

async function pollStatus() {
    try {
        const currentStatus = await apiService.getStatus();
        const currentStatusMessage = currentStatus.message;

        if (currentStatusMessage && JSON.stringify(currentStatusMessage) !== JSON.stringify(previousStatus) && currentStatusMessage.onVoiceChannel) {
            if (previousStatus) {
                if (previousStatus.loopMode !== currentStatusMessage.loopMode) {
                    console.log("hello world")
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
        } else {
            console.log("No changes");
            setTimeout(pollStatus, 3000); 
        }
    } catch (error) {
        console.error('There was an error: ', error.code);
        console.log("Bot will continue to work without API connection");
        apiService.connection = false;
    } 
}

async function onPropertyChange(guildId, property, oldValue, newValue) {
    const queue = useQueue(guildId);
    switch (property) {
        case 'LoopMode':
            switch (newValue) {
                case 0:
                    queue.setRepeatMode(0);
                    console.log(`LoopMode: ${newValue}`);
                    break;
                case 1:
                    queue.setRepeatMode(1);
                    console.log(`LoopMode: ${newValue}`);
                    break;
                case 2:
                    queue.setRepeatMode(2);
                    console.log(`LoopMode: ${newValue}`);
                    break;
                default:
                    break;
            }
            break;
        case 'Volume':
            queue.node.setVolume(newValue);
            console.log(`Volume: ${newValue}`);
            break;
        case 'SkipQueued':
            if (newValue) {
                queue.node.skip();
                await apiService.setSkipQueued(false);
            }
            console.log(`SkipQueued: ${newValue}`);
            break;
        default:
            console.log(`cannot set property of name ${property}`);
    }
}

module.exports = {pollStatus};