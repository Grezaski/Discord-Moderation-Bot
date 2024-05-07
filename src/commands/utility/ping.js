const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client, } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows API Latency / Bot ping"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    return interaction.reply({
      content: '`🏓` Pong! Lantency: ' + client.ws.ping + 'ms'
  });
}
};