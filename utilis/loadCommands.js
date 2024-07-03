const { Collection} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { Logger } = require("../utilis/Logger.js");
const logger = Logger.getLogger()
const loadCommands = (client) => {
    const commands = [];
    client.commands = new Collection();
    const commandsPath = path.join(__dirname,'..', "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            logger.logError(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }}
module.exports = {loadCommands};