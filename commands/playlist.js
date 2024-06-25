const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player"); 
const { EmbedBuilder } = require('discord.js');


function sendEmbed(interaction) {
    let queue = useQueue(interaction.guild.id);
    queue = queue.tracks.toArray();
    if(queue.length == 0) return interaction.reply("**There is no queue**");
    let queueSongs = getSongs(queue);
    let queueEmbed = [];
    queueSongs.forEach(element => {
        let embed = new EmbedBuilder().setColor("#ff0000").setTitle("Queue").addFields(element);
        queueEmbed.push(embed);
    })
    if(queueEmbed.length<10)
    {
        return interaction.reply({ embeds: queueEmbed });
    }
    return interaction.reply("**Queue is too large for discord API**");
    
    


}

function getSongs(queue, iterator = 0) {
    if (iterator < queue.length) { 
        let songs = [];
        for (let i = iterator; i < iterator + 25 && i < queue.length; i++) {
            songs.push({
                name: `${i}`,
                value: queue[i].title
            });
        }
        
        let nextsongs = getSongs(queue, iterator + 25); 
        return [songs].concat(nextsongs); 
    }
    return [];
}

module.exports = {
	data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Display current queue"),
	execute: async ({ interaction }) => {
        sendEmbed(interaction);

    }
	}
