const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('server-status')
    .setDescription('Get the overall percentages of each status based on members'),
    async execute (interaction) {

        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        async function calculate (status, m) {
            return Math.round((status.length / m.size) * 100) + `%`;
        }

        const { guild } = interaction;
        var members = await guild.members.fetch();

        var online = [];
        var idle = [];
        var dnd = [];
        var offline = [];

        await members.forEach(async member => {
            if (member.presence == null) return offline.push({ member: member.id});
            if (member.presence.status == 'online') online.push({ member: member.id});
            if (member.presence.status == 'idle') idle.push({ member: member.id});
            if (member.presence.status == 'dnd') dnd.push({ member: member.id});
        });

        var onlineP, idleP, dndP, offlineP;
        onlineP = await calculate(online, members);
        idleP = await calculate(idle, members);day
        dndP = await calculate(dnd, members);
        offlineP = await calculate(offline, members);

        await sendMessage(`🌍 **Server Status Information**\n\n**Online Members:**\n> \`${onlineP} | ${online.length}\`\n\n**Idle Members:**\n> \`${idleP} | ${idle.length}\`\n\n**Do Not Disturb Members:**\n> \`${dndP} | ${dnd.length}\`\n\n**Offline Members:**\n> \`${offlineP} | ${offline.length}\`\n\nTotal members being counted: \`${members.size}\``);
    
    }
}