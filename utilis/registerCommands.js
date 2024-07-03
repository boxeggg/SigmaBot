const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Logger } = require("../utilis/Logger.js");
const logger = Logger.getLogger()

const registerCommands = async (guildId, client) => {
    const commands = client.commands.map(cmd => cmd.data.toJSON());
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

        try {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: commands }
            );
            logger.logInfo(`Added commands to guild ${guildId}`);
        } catch (error) {
            logger.logError(`Failed to add commands to guild ${guildId}`, error);
        }
    
}
module.exports = {registerCommands};