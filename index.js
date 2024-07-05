
require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});
const { loadCommands } = require("./utilis/loadCommands.js");
const { registerCommands } = require("./utilis/registerCommands.js");
const {createGuild } = require("./utilis/createGuild.js");
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
        let lastTrack = await apiService.getLastRequest(queue.metadata.guild.id)
        requestedBy = lastTrack.user;
        thumbnail = lastTrack.thumbnail_Url;
        await apiService.addRequest({
        Name: track.title,
        Url: track.url,
        User: requestedBy,
        thumbnail_Url: thumbnail,
        GuildID: queue.metadata.guild.id
    });
    await apiService.deleteLastRequest(queue.metadata.guild.id);
    }
    if(queue.repeatMode === 0)
    {
        await apiService.deleteLastRequest(queue.metadata.guild.id);
    }
    }
    return queue;
});

player.events.on('error',  async (queue, error) => {
    queue.metadata.channel.send(`**There was an error with playing ${track.name}**`);
    console.log(error);
});
player.events.on('playerError', async  (queue, error) => {
    await apiService.deleteLastRequest(queue.metadata.guild.id);
    queue.metadata.channel.send(`**Cant find your video or it is NSFW**`);
    console.log(error);
});
player.events.on('disconnect', async (queue) => {
    if(apiService.connection){
        await apiService.setOnVoiceChannel(false,queue.metadata.guild.id);
        await apiService.clearQueue(queue.metadata.guild.id);
        await apiService.resetStatus(queue.metadata.guild.id);
        apiService.isPolling = false;
    }
    queue.metadata.channel.send('**No music found in queue, leaving the voice channel...**');
});

client.once("ready", async () => {
    

    client.user.setActivity('Use /play 🤫🧏🏻‍♂️');
    logger.logInfo('Bot is ready!');
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    try{
    guild_ids.forEach(async element => {

        await apiService.getStatusWithCreate(element)
        await apiService.clearQueue(element)
        await apiService.resetStatus(element);
        apiService.connection = true;
    });
    }
    
    catch(error){
        logger.logError("API connection error: ", error.code);
        logger.logWarn("Bot will continue to work without API connection");
    }
    loadCommands(client);
    

});
client.on('guildCreate', async guild => {
    await registerCommands(guild.id,client);
    await apiService.getStatusWithCreate(guild.id);
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