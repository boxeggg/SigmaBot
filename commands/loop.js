const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer, useQueue } = require("discord-player"); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the current song or queue')
        .addStringOption(option => 
            option.setName('mode')
                .setDescription('Choose a loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: '0' },
                    { name: 'Song', value: '1' },
                    { name: 'Queue', value: '2' }
                )
        ),
    async execute({ interaction }) {
        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return interaction.reply({ content: 'There is no song playing currently.', ephemeral: true });
        }
        const loopMode = interaction.options.getString('mode');
        switch (loopMode) {
            case '0':
                queue.setRepeatMode(0);
                await interaction.reply({ content: 'Looping is now off.' });
                break;
            case '1':
                queue.setRepeatMode(1);
                await interaction.reply({ content: `Looping the current song:  **${queue.currentTrack.title}**` });
                break;
            case '2':
                queue.setRepeatMode(2);
                await interaction.reply({ content: 'Looping the queue.' });
                break;
            default:
                await interaction.reply({ content: 'Invalid loop mode.', ephemeral: true });
                break;
        }
    },
};