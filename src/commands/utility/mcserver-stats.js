const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js'); 

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mcserver-status')
    .setDescription('Check the status of a minecraft server!')
    .addStringOption(option => option.setName('ip').setDescription('The IP of the minecraft server').setRequired(true)),
    async execute (interaction) {

        const { options } = interaction;
        const ip = options.getString('ip');

        var msg;
        async function sendMessage(message, button, updated) {
            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(message);

            if (button) {
                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('mcserverRefresh')
                    .setLabel(`🌳 Refresh Statistics`)
                    .setStyle(ButtonStyle.Danger)
                );

                if (updated) {
                    await interaction.editReply({embeds: [embed], components:[button] });
                    await updated.reply({ content: `🌍 I have updated your stats`, ephemeral: true });
                } else {
                    msg = await interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
                }

            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        
        }

        var getData = await fetch(`https://mcapi.us/server/status?ip=${ip}`);
        var response = await getData.json();

        if (response.status == 'error') {
            await sendMessage(`⚠️ \`${ip}\` is either **offline** or does not exist!`);
        }

        if (response.status == 'success') {
            await sendMessage(`🌍 **Minecraft Server Stats:** \n\nOnline: ${response.online}\nName: ${response.server.name}\nIP: ${ip.toLowerCase()}\nPlayer Max: ${response.players.max}\nCurrent Players: ${response.players.now}`, true);
            const collector = msg.createMessageComponentCollector();
            collector.on('collect', async i => {
                if (i.customId == 'mcserverRefresh') { 
                    var updatedData = await fetch(`https://mcapi.us/server/status?ip=${ip}`);
                    var response = await updatedData.json();
                    await sendMessage(`🌍 **Minecraft Server Stats:** \n\nOnline: ${response.online}\nName: ${response.server.name}\nIP: ${ip.toLowerCase()}\nPlayer Max: ${response.players.max}\nCurrent Players: ${response.players.now}`, true, i);
                }
            });
        }

    }
}