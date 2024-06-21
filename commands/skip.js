const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { GuildQueue, useQueue } = require("discord-player"); 

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
	execute: async ({ interaction }) => {
	
        const queue = useQueue(interaction.guild.id)
        queue.node.skip();
        return interaction.reply(`Skipped **${queue.currentTrack.title}**!`);
        }
	}
