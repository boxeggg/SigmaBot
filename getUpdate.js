const { ApiService } = require("./ApiService");
const { GuildQueue, useQueue } = require("discord-player"); 
let apiService = ApiService.getInstance();

async function pollStatus(previousStatus){
    currentStatus = await apiService.getStatus()
    currentStatus = currentStatus.message;
    try{
    if (currentStatus && JSON.stringify(currentStatus) !== JSON.stringify(previousStatus)) {
        if (previousStatus.LoopMode !== currentStatus.LoopMode) {
            onPropertyChange(currentStatus.GuildId, 'LoopMode', previousStatus.LoopMode, currentStatus.LoopMode);
        }
        if (previousStatus.Volume !== currentStatus.Volume) {
            onPropertyChange(currentStatus.GuildId, 'Volume', previousStatus.Volume, currentStatus.Volume);
        }
        if (previousStatus.SkipQueued !== currentStatus.SkipQueued) {
            onPropertyChange(currentStatus.GuildId, 'SkipQueued', previousStatus.SkipQueued, currentStatus.SkipQueued);
        }
        previousStatus = currentStatus.message;
    }
    }
    catch(error){
        console.error('There was an error:', error);
    }
}

function onPropertyChange(guildId,property,oldValue, newValue){
    const queue = useQueue(guildId);
    switch(property) {
        case 'LoopMode':
            switch (loopMode) {
                case '0':
                    queue.setRepeatMode(0);
                    break;
                case '1':
                    queue.setRepeatMode(1);
                    break;
                case '2':
                    queue.setRepeatMode(2);
                    break;
                default:
                    break;
            }
        case 'Volume':
            // Dodaj logikę dla zmiany Volume
            console.log(`Zaktualizowano Volume: ${newValue}`);
            break;
        case 'SkipQueued':
            if(oldValue){
                queue.node.skip();
                apiService.setSkipQueued(false)
            }
            console.log(`Zaktualizowano SkipQueued: ${newValue}`);
            break;
        default:
            console.log(`Nieznana właściwość: ${property}`);
    }
}
async function getUpdate(){
    let previousStatus = await apiService.getStatus()
    setInterval(async () => {
        if(previousStatus.status)
        {
            pollStatus(previousStatus.message)
    
        }
        else
        {
            console.log("Cannot connect to the API:", previousStatus.message)
        }
    }, 3000)
}

module.exports = {getUpdate};