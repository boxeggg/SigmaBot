const { ApiService } = require("./utilis/ApiService.js");
require('dotenv').config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { pollStatus } = require("./utilis/getUpdate.js")
const { Player } = require("discord-player");
const fs = require("node:fs");
const path = require("node:path");

let apiService = ApiService.getInstance(process.env.API_URL)
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});


const player =  new Player(client);
player.extractors.loadDefault((ext) => ext);

player.events.on('playerStart', async (queue, track) =>  {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
    return queue;
});
player.events.on('playerFinish', async (queue, track) =>  {
    if(apiService.connection){
    let requestedBy = await apiService.getLastRequest()
    requestedBy = requestedBy.user;
    if(queue.repeatMode === 2){
        await apiService.addRequest({
        Name: track.title,
        Url: track.url,
        User: requestedBy,
        thumbnail_Url: search.tracks[i].thumbnail
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

const loadCommands = () => {
const commands = [];
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}}
const registerCommands = async () => {
    const commands = client.commands.map(cmd => cmd.data.toJSON());
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    for (const guildId of guild_ids) {
        try {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: commands }
            );
            console.log(`Added commands to guild ${guildId}`);
        } catch (error) {
            console.error(`Failed to add commands to guild ${guildId}`, error);
        }
    }
}
client.once("ready", async () => {

    client.user.setActivity('Use /play 🤫🧏🏻‍♂️');
    console.log('Bot is ready!');
    try{
        await apiService.clearQueue()
        await apiService.resetStatus();
        apiService.connection = true;
        console.log("Estabilished API connection");
    }
    catch(error){
        console.log("API connection error: ", error.code);
        console.log("Bot will continue to work without API connection");
    }
    loadCommands();
    await registerCommands();

});
client.on('guildCreate', async guild => {
    await registerCommands(guild.id);
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