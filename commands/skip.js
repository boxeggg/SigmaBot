const { SlashCommandBuilder } = require("@discordjs/builders")

const { GuildQueue, useQueue } = require("discord-player"); 
const { ApiService } = require("../utilis/ApiService");

let apiService = ApiService.getInstance(process.env.API_URL)

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
	execute: async ({ interaction }) => {
        const queue = useQueue(interaction.guild.id);
        if(apiService.connection)
        {
                await apiService.setSkipQueued(true);
                return interaction.reply(`Skipped **${queue.currentTrack.title}**!`);
        }
        else
        {
                queue.node.skip();
                return interaction.reply(`Skipped **${queue.currentTrack.title}**!`);
        }

        }
	}
