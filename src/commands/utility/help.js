const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client, } = require("discord.js");
const buildHelpEmbed = require("../../utils/helpEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays all of the bots commands."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    await interaction.reply({
      embeds: [buildHelpEmbed(client)],
    });
  },
};
