const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, } = require("discord.js");

module.exports = {
  memberPerms: PermissionFlagsBits.BanMembers,
  botPerms: PermissionFlagsBits.BanMembers,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans specified user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Specify the user you want to ban.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const userID = interaction.options.getUser("user");

    if (interaction.member.id === userID)
      return await interaction.reply({
        content: "You **cannot** unban yourself.",
      });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`User was unbanned!`)
      .addFields({ name: "User: ", value: `> ${userID}`, inline: true })
      .addFields({
        name: "Moderator: ",
        value: `> ${interaction.user.globalName}`,
        inline: true,
      });

    await interaction.guild.bans.fetch().then(async (bans) => {
      if (bans.size == 0)
        return await interaction.reply({
          content: "This guild has zero bans.",
          ephemeral: true,
        });
      let bannedID = bans.find((ban) => ban.user.id == userID);
      if (!bannedID)
        return await interaction.reply({
          content: "That user **is not** banned.",
          ephemeral: true,
        });

      await interaction.guild.bans.remove(userID).catch(() => {
        return interaction.reply({
          content: `**Couldn't** unban the specified user!`,
          ephemeral: true,
        });
      });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
