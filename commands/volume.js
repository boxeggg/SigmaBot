const { SlashCommandBuilder } = require("@discordjs/builders")

const { GuildQueue, useQueue } = require("discord-player"); 
const { ApiService } = require("../utilis/ApiService");

let apiService = ApiService.getInstance(process.env.API_URL);

module.exports = {
	data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Set Volume of the current song").addIntegerOption(option => option.setName("value").setDescription("Volume value").setMinValue(0).setMaxValue(200).setRequired(true)),
	execute: async ({ interaction }) => {
        const queue = useQueue(interaction.guild.id);
        const value = interaction.options.getInteger("value", true)
        if(apiService.connection)
        {          
                await apiService.setVolume(value)
                return interaction.reply(`Changed volume to **${value}** !`);
        }
        else
        {
                queue.node.setVolume(value);
                return interaction.reply(`Changed volume to **${value}** !`);
        }

        }
	}
