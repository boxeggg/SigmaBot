const { SlashCommandBuilder } = require("@discordjs/builders");
const { useMainPlayer } = require("discord-player"); 
const { ApiService } = require("../ApiService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song from YouTube.").addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Plays a single song from YouTube.")
                .addStringOption(option => option.setName("url").setDescription("The song's URL.").setRequired(true))
        ),
    execute: async ({interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.reply("You need to be in a Voice Channel to play a song.");
        }
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        await interaction.deferReply();

        if (interaction.options.getSubcommand() === "song") {
            try {
                let query = interaction.options.getString("url", true);

                const { track } = await player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction 
                    }
                });
                if(track.playlist)
                {
                return interaction.followUp(`**${track.playlist.title}** enqueued!`);
                }
                else
                {
                    return interaction.followUp(`**${track.title}** enqueued!`);
                }
                
            } catch (error) {
                console.error(error);
                return interaction.followUp(`Cant play a track`);
                
            }
    }
}};