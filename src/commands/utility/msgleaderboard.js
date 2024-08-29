const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lb = require('../../Schemas/msgleaderboard');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('message-leaderboard')
    .setDescription('Message leaderboard')
    .addSubcommand(command => command.setName('user').setDescription('A specific users messages + leaderboard standing').addUserOption(option => option.setName('user').setDescription('The user to check').setRequired(true)))
    .addSubcommand(command => command.setName('total').setDescription('The total message leaderboard')),
    async execute (interaction) {

        const { options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'user':

                async function total() {
                    var data = await lb.find({ Guild: interaction.guild.id});
                    var standings = [];
                    await data.forEach(async d => {
                        standings.push({
                            user: d.User,
                            messages: d.Messages
                        });
                    });

                    return standings;
                }

                async function lbUser(user) {
                    var data = await lb.find({ Guild: interaction.guild.id});
                    if (!data) return 'No data found';

                    if (user) {
                        var standings = await total();
                        standings.sort((a, b) => b.messages - a.messages);
                        return standings.findIndex((item) => item.user === user) + 1;
                    }
                }

                const user = options.getUser('user');
                const data = await lb.findOne({ Guild: interaction.guild.id, User: user.id });
                if (!data) return await interaction.reply({ content: `⚠️ Looks like you have 0 message history logged with this bot!`, ephemeral: true });
                else {
                    var t = await total().then(async data => {return data.length});

                    const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`${interaction.user.username}'s Message Standings`)
                    .addFields({ name: 'Total Messages', value: `\`${data.Messages}\`` })
                    .addFields({ name: 'Leaderboard Standing', value: `\`#${await lbUser(user.id)}/${t}\``})
                    .setTimestamp();

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }

            break;
            case 'total':
                const data2 = await lb.findOne({ Guild: interaction.guild.id});
                if (!data2) return await interaction.reply({ content: `⚠️ Looks like you have 0 message history logged with this bot!`, ephemeral: true });
                else {
                    var leaderboard = await total();
                    leaderboard.sort((a, b) => b.messages - a.messages);
                    var output = leaderboard.slice(0, 10);

                    var string;
                    var num = 1;
                    await output.forEach(async value => {
                        const member = await interaction.guild.members.cache.get(value.user);
                        string += `#${num} Member: **${member.user.username}**, Messages: \`${value.messages}\`\n`;
                        num++;
                    });

                    string = string.replace('undefined', '');

                    const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`${interaction.guild.name}'s Message Leaderboard 1-10`)
                    .setDescription(`${string}`);

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
        }
    }
}