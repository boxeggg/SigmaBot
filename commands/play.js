const { SlashCommandBuilder } = require("@discordjs/builders");
const { useMainPlayer, SearchResult, GuildQueue, useQueue } = require("discord-player");
const { ApiService } = require("../utilis/ApiService");
const { Poller } = require("../utilis/Poller.js");
const { Logger } = require("../utilis/Logger.js");
const logger = Logger.getLogger()
let apiService = ApiService.getInstance(process.env.API_URL);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song or playlist").addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Plays a song or playlist from any service.")
                .addStringOption(option => option.setName("url").setDescription("The song's URL.").setRequired(true))
        ),
    execute: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.reply("You need to be in a Voice Channel to play a song.");
        }
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        await interaction.deferReply();
        if (interaction.options.getSubcommand() === "song") {
            try {
                if (apiService.connection) {
                    let poller = Poller.getInstance(interaction.guild.id);
                    let search = await player.search(interaction.options.getString("url", true));
                    if (search.hasPlaylist()) {
                        
                        trackPlaylist = [];
                        for (let i = 0; i < search.tracks.length; i++) {
                            trackPlaylist.push({
                                Name: search.tracks[i].title,
                                Url: search.tracks[i].url,
                                User: interaction.member.displayName,
                                Thumbnail_Url: search.tracks[i].thumbnail,
                                GuildId: interaction.guild.id
                            }
                            )
                        }
                        response = await apiService.addPlaylist(trackPlaylist);
                        
                        interaction.followUp(`**${search.playlist.title}** enqueued!`);
                    }
                    else {
                        response = await apiService.addRequest({
                            Name: search.tracks[0].title,
                            Url: interaction.options.getString("url", true),
                            User: interaction.member.displayName,
                            thumbnail_Url: search.tracks[0].thumbnail,
                            GuildId: interaction.guild.id
                        })
                        
                        interaction.followUp(`**${search.tracks[0].title}** enqueued!`);
                    }
                    const { track } = await player.play(channel, search.query, {
                        nodeOptions: {
                            metadata: interaction
                        }
                    });
                    if(!poller.isPolling)
                    {
                    await apiService.setOnVoiceChannel(true,interaction.guild.id);
                    await poller.pollStatus();
                    logger.logInfo("Polling status",interaction.guild.id);
                    
                    }
                    
                    
                }
                else
                {
                let query = await player.search(interaction.options.getString("url", true));
                const { track } = await player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction
                    }
                });
                if(query.hasPlaylist())
                {
                    interaction.followUp(`**${query.playlist.title}** enqueued!`);
                }
                else
                {
                    interaction.followUp(`**${query.tracks[0].title}** enqueued!`);
                }
                }
            }
            catch (error) {
                logger.logError(error);
                return interaction.followUp(`Cant play a track`);

            }
        }
    }
};