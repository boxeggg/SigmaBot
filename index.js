
require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});
const { loadCommands } = require("./utilis/loadCommands.js");
const { registerCommands } = require("./utilis/registerCommands.js");
const { Logger } = require("./utilis/Logger.js");
const { ApiService } = require("./utilis/ApiService.js");
let apiService = ApiService.getInstance(process.env.API_URL)
const logger = Logger.getLogger();


const player =  new Player(client);
player.extractors.loadDefault((ext) => ext);

player.events.on('playerStart', async (queue, track) =>  {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
    return queue;
});
player.events.on('playerFinish', async (queue, track) =>  {
    if(apiService.connection){
    if(queue.repeatMode === 2){
        let lastTrack = await apiService.getLastRequest()
        requestedBy = lastTrack.user;
        thumbnail = lastTrack.thumbnail_Url;
        await apiService.addRequest({
        Name: track.title,
        Url: track.url,
        User: requestedBy,
        thumbnail_Url: thumbnail
    });
    await apiService.deleteLastRequest();
    }
    if(queue.repeatMode === 0)
    {
        await apiService.deleteLastRequest();
    }
    }
    return queue;
});

player.events.on('error',  async (queue, error) => {
    queue.metadata.channel.send(`**There was an error with playing ${track.name}**`);
    console.log(error);
});
player.events.on('playerError', async  (queue, error) => {
    await apiService.deleteLastRequest();
    queue.metadata.channel.send(`**Cant find your video or it is NSFW**`);
    console.log(error);
});
player.events.on('disconnect', async (queue) => {
    if(apiService.connection){
        await apiService.setOnVoiceChannel(false);
        await apiService.clearQueue();
        await apiService.resetStatus();
        apiService.isPolling = false;
    }
    queue.metadata.channel.send('**No music found in queue, leaving the voice channel...**');
});

client.once("ready", async () => {
    

    client.user.setActivity('Use /play 🤫🧏🏻‍♂️');
    logger.logInfo('Bot is ready!');
    try{
        await apiService.clearQueue()
        await apiService.resetStatus();
        apiService.connection = true;
        logger.logInfo("Estabilished API connection");
    }
    catch(error){
        logger.logError("API connection error: ", error.code);
        logger.logWarn("Bot will continue to work without API connection");
    }
    loadCommands(client);
    

});
client.on('guildCreate', async guild => {
    await registerCommands(guild.id,client);
});
   
  
   



client.on("interactionCreate", async interaction => {
    
    if (!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute({ client, interaction });
    } catch (err) {
        console.error(err);
        await interaction.reply("An error occurred while executing that command");
    }
});

client.login(process.env.TOKEN);