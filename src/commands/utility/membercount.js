const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Get the server member count."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTimestamp()
          .addFields({
            name: "Members",
            value: `${interaction.guild.memberCount}`,
          }),
      ],
    });
  },
};