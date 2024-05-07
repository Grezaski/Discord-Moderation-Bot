const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, } = require("discord.js");

module.exports = {
  memberPerms: PermissionFlagsBits.BanMembers,
  botPerms: PermissionFlagsBits.BanMembers,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a given user from the server.")
    .addUserOption((op) =>
      op
        .setName("user")
        .setDescription("The member you want to ban.")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("reason")
        .setDescription("The reason for the ban.")
        .setRequired(false)
    )
    .addStringOption((op) =>
      op
        .setName("delete-messages")
        .setDescription("Delete the banned users messages?")
        .addChoices(
          { name: "Yes", value: "true" },
          { name: "No", value: "false" }
        )
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
    const target = options.getUser("user");
    const bot = interaction.guild.members.me;

    const embed = new EmbedBuilder();

    let delMessages = options.getString("delete-messages");
    const reason = options.getString("reason") || "No reason provided.";
    delMessages === "true" ? (delMessages = true) : (delMessages = false);

    if (targetMember.roles.highest.poistion >= member.roles.highest.position)
      return interaction.reply({
        embeds: [
          embed
            .setColor("Red")
            .setDescription(
              `❌ **You cannot ban this member as they have a higher role than you.**`
            ),
        ],
      });

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

    const emBan = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Member Banned!`)
      .addFields(
        { name: `Member Tag: `, value: `> \`${target.tag}\``, inline: true },
        { name: `Member ID: `, value: `> \`${target.id}\``, inline: true },
        {
          name: `Banned By: `,
          value: `> \`${interaction.user.globalName}\``,
          inline: true,
        },
        { name: `Ban Reason: `, value: `\`${reason}\`` }
      )
      .setTimestamp();

    const em2 = new EmbedBuilder()
      .setColor("Red")
      .setTitle(`You Banned.`)
      .setFields(
        { name: "Ban Reason", value: `\`${reason}\`` },
        {
          name: "Banned By: ",
          value: `> \`${interaction.user.username}\``,
          inline: true,
        },
        {
          name: "Banned Server: ",
          value: `> \`${interaction.guild.name}\``,
          inline: true,
        },
        {
          name: `Timestamp: <t:${Math.floor(
            interaction.createdTimestamp / 1000
          )}>`,
          value: `\u200b`,
          inline: true,
        }
      )
      .setFooter({
        iconURL: `${interaction.guild.iconURL()}`,
        text: `Sent from ${interaction.guild.name}`,
      })
      .setTimestamp();

    if (delMessages) {
      await targetMember.send({ embeds: [em2] }).catch(() => {});
      await targetMember
        .ban({ reason: reason, deleteMessageSeconds: 60480 })
        .then(() => {
          interaction.reply({ embeds: [emBan] });
        });
    } else {
      await targetMember.send({ embeds: [em2] }).catch(() => {});
      await targetMember.ban({ reason: reason }).then(() => {
        interaction.reply({ embeds: [emBan] });
      });
    }
  },
};
