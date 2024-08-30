const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows API Latency / Bot ping"),

  async execute(interaction, client) {
    const pingEmbed = new EmbedBuilder()
      .setTitle("Ping Results")
      .addField("API Latency", `${client.ws.ping}ms`, true)
      .setColor("BLUE");

    const reloadButton = new ButtonBuilder()
      .setCustomId("reload-ping")
      .setLabel("Reload")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(reloadButton);

    await interaction.reply({ embeds: [pingEmbed], components: [row] });

    const filter = (interaction) => interaction.customId === "reload-ping" && interaction.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on("collect", async (i) => {
      const newPing = client.ws.ping;
      pingEmbed.fields[0].value = `${newPing}ms`;
      await i.update({ embeds: [pingEmbed] });
    });
  },
};
