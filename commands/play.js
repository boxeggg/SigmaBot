const { SlashCommandBuilder } = require("@discordjs/builders");
const { useMainPlayer, SearchResult,GuildQueue, useQueue } = require("discord-player"); 
const { ApiService } = require("../ApiService");
let apiService = ApiService.getInstance("localhost:5205")
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
            let search = await player.search(interaction.options.getString("url", true))
            if(search.hasPlaylist()){
                trackPlaylist = [];
                for(i = 0; i<search.tracks.length;i++){
                    trackPlaylist.push({
                        Name: search.tracks[i].title,
                        Url: search.tracks[i].url,
                        User: interaction.member.displayName
                    })}
                response = await  apiService.addPlaylist(trackPlaylist);
                console.log(response);
                interaction.followUp(`**${search.playlist.title}** enqueued!`);
                }          
            else{
                response = await apiService.addRequest({
                    Name: search.tracks[0].title,
                    Url: interaction.options.getString("url", true),
                    User: interaction.member.displayName
                })
                
                interaction.followUp(`**${search.tracks[0].title}** enqueued!`);
        

            }
                let query = await apiService.getLastRequest()
                const { track } = await player.play(channel, search, {
                    nodeOptions: {
                        metadata: interaction 
                    }
                });
            } catch (error) {
                console.log(error);
                return interaction.followUp(`Cant play a track`);
                
            }
    }
}};