const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, } = require("discord.js");

module.exports = {
  memberPerms: PermissionFlagsBits.ModerateMembers,
  botPerms: PermissionFlagsBits.ModerateMembers,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Untimeout / Unmute a user.")
    .addUserOption((op) =>
      op
        .setName("user")
        .setDescription("The member you want to unmute.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options, member } = interaction;
    const targetMember = options.getMember("user");
    const bot = interaction.guild.members.me;

    const embed = new EmbedBuilder();

    if (
      targetMember.roles.highest.poistion >= bot.roles.highest.position ||
      targetMember.permissions.has(PermissionFlagsBits.Administrator)
    )
      return interaction.reply({
        embeds: [
          embed
            .setColor("Red")
            .setDescription(
              `❌ **That user is Mod/Admin I cannot do that.**`
            ),
        ],
      });

    const emMute = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Member unmuted!`)
      .setDescription(
        `👌 **Successfully unmuted ${targetMember.user.username}.**`
      )
      .setTimestamp();

    await targetMember.timeout(null).then(() => {
      interaction.reply({ embeds: [emMute] });
    });
  },
};
