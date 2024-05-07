const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, } = require("discord.js");

module.exports = {
  memberPerms: PermissionFlagsBits.ManageMessages,
  botPerms: PermissionFlagsBits.ManageMessages,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete a number of messages")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to purge.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { channel, options } = interaction;
    const amount = options.getNumber("amount");
    let mVar = amount > 1 ? "messages" : "message";

    const em = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `👌 **Purged \`${amount}\` ${mVar} messages in <#${channel.id}>**`
      )
      .setTitle(`Purged ${mVar}!`);

    await channel.bulkDelete(amount, true).then(() => {
      interaction.reply({ embeds: [em] });
      setTimeout(() => interaction.deleteReply(), 5000);
    });
  },
};
