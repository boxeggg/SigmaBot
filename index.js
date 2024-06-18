const { ApiService } = require("./ApiService.js");
require('dotenv').config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const { Player } = require("discord-player");
const fs = require("node:fs");
const path = require("node:path");

let apiService = new ApiService("localhost:5205");


const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});
const player =  new Player(client);
player.extractors.loadDefault((ext) => ext);

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
}
player.events.on('playerStart', async (queue, track) =>  {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
    return queue;
});
player.events.on('playerSkip', async (queue, track) =>  {
    await apiService.deleteLastRequest();
    queue.metadata.channel.send(`Skipped **${track.title}**!`);
    return queue;
});
player.events.on('error', (queue, error) => {
    queue.metadata.channel.send(`**There was an error with playing ${track.name}**`);
    console.log(error);
});
player.events.on('playerError', (queue, error) => {
    queue.metadata.channel.send(`**Cant find your video or it is NSFW**`);
    console.log(error);
});


client.once("ready", async () => {
    console.log('Bot is ready!');
    await apiService.clearQueue()
   

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