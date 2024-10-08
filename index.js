const { YoutubeiExtractor } = require("discord-player-youtubei")

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
const player = new Player(client);


async function loadExtractors() {
   await player.extractors.register(YoutubeiExtractor, {
    streamOptions: {
       useClient: "ANDROID"
    }});
   await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
}


player.events.on('playerStart', async (queue, track) => {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
    return queue;
});
player.events.on('playerFinish', async (queue, track) => {
    if (apiService.connection) {
        if (queue.repeatMode === 2) {
            await apiService.addRequest({
                Name: track.title,
                Url: track.url,
                User: "SigmaBot",
                thumbnail_Url: track.thumbnail,
                GuildID: queue.metadata.guild.id
            });
            await apiService.deleteLastRequest(queue.metadata.guild.id);
        }
        if (queue.repeatMode === 0) {
            await apiService.deleteLastRequest(queue.metadata.guild.id);
        }
    }
    return queue;
});

player.events.on('error', async (queue, error) => {
    queue.metadata.channel.send(`**There was an error with playing ${track.name}**`);
    console.log(error);
});
player.events.on('playerError', async (queue, error) => {
    if(apiService.connection) await apiService.deleteLastRequest(queue.metadata.guild.id);
    queue.metadata.channel.send(`**Cant find your video or it is NSFW**`);
    console.log(error);
});
player.events.on('disconnect', async (queue) => {
    if (apiService.connection) {
        await apiService.setOnVoiceChannel(false, queue.metadata.guild.id);
        await apiService.clearQueue(queue.metadata.guild.id);
        await apiService.resetStatus(queue.metadata.guild.id, queue.metadata.guild.name);
        apiService.isPolling = false;
    }
    queue.metadata.channel.send('**No music found in queue, leaving the voice channel...**');
});
player.events.on('emptyChannel', async (queue) => {
    if (apiService.connection) {
        await apiService.setOnVoiceChannel(false, queue.metadata.guild.id);
        await apiService.clearQueue(queue.metadata.guild.id);
        await apiService.resetStatus(queue.metadata.guild.id, queue.metadata.guild.name);
        apiService.isPolling = false;
    }
    queue.metadata.channel.send('**Channel is empty leavin the voice...**');
});
// player.on('debug', async (message) => {

//     console.log(`General player debug event: ${message}`);
// });

// player.events.on('debug', async (queue, message) => {

//     console.log(`Player debug event: ${message}`);
// });

client.once("ready", async () => {


    client.user.setActivity('Use /play 🤫🧏🏻‍♂️');
    logger.logInfo('Bot is ready!');
    await loadExtractors()
    const guild_ids = client.guilds.cache.map(guild => guild);
    if (apiService.connection) {
        try{
            for (const element of guild_ids) {
                await apiService.getStatusWithCreate(element.id, element.name);
                await apiService.clearQueue(element.id);
                await apiService.resetStatus(element.id);
            }

        }
        catch(error){
            logger.logError(`${error}`);
            logger.logWarn("Bot will continue to work without API connection");
        }
           
    }
    loadCommands(client);


});
client.on('guildCreate', async guild => {
    await registerCommands(guild.id, client);
    if (apiService.connection) {
        await apiService.getStatusWithCreate(guild.id, guild.name);
    }

});
/// guildDelete, guildUpdate
client.on('guildDelete', async guild => {
    if (apiService.connection) {
        await apiService.deleteStatus(guild.id);
    }
 
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