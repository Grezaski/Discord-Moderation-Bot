const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, } = require("discord.js");


module.exports = {
  memberPerms: PermissionFlagsBits.ManageNicknames,
  botPerms: PermissionFlagsBits.ManageNicknames,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("modname")
    .setDescription("Moderate a users name to - Moderated Nickname 1234.")
    .addUserOption((op) =>
      op
        .setName("user")
        .setDescription("The member to moderate the username.")
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
            .setColor(errorColor)
            .setDescription(
              `❌ **That user is Mod/Admin I cannot do that.**`
            ),
        ],
      });

    const newName = moddedName();
    await targetMember.setNickname(newName);
    embed
      .setColor("Green")
      .setDescription(
        `👌 **I have set ${targetMember.user.username}'s nickname to ${newName}`
      );

    await interaction.reply({ embeds: [embed] });
  },
};

function moddedName() {
  const number = Math.floor(Math.random() * 1000 + 1);
  return `Moderated Nickname ${number}`;
}
