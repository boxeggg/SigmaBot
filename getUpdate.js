const { ApiService } = require("./ApiService");
const { useQueue } = require("discord-player");

let apiService = ApiService.getInstance("localhost:5205");
let previousStatus = null; 

async function pollStatus() {
    try {
        const currentStatus = await apiService.getStatus();
        const currentStatusMessage = currentStatus.message;

        if (currentStatusMessage && JSON.stringify(currentStatusMessage) !== JSON.stringify(previousStatus)) {
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
        } else {
            console.log("No changes");
        }
    } catch (error) {
        console.error('There was an errror', error);
    } finally {
        setTimeout(pollStatus, 3000); 
    }
}

async function onPropertyChange(guildId, property, oldValue, newValue) {
    const queue = useQueue(guildId);
    switch (property) {
        case 'LoopMode':
            switch (newValue) {
                case 0:
                    queue.setRepeatMode(0);
                    break;
                case 1:
                    queue.setRepeatMode(1);
                    break;
                case 2:
                    queue.setRepeatMode(2);
                    break;
                default:
                    break;
            }
            break;
        case 'Volume':
            // Dodaj logikę dla zmiany Volume
            console.log(`Zaktualizowano Volume: ${newValue}`);
            break;
        case 'SkipQueued':
            if (newValue) {
                queue.node.skip();
                let response = await apiService.setSkipQueued(false);
                console.log(response);
            }
            console.log(`Zaktualizowano SkipQueued: ${newValue}`);
            break;
        default:
            console.log(`Nieznana właściwość: ${property}`);
    }
}

module.exports = {pollStatus};