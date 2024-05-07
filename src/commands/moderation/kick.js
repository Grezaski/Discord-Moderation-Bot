const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, } = require("discord.js");

module.exports = {
  memberPerms: PermissionFlagsBits.KickMembers,
  botPerms: PermissionFlagsBits.KickMembers,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a given user from the server.")
    .addUserOption((op) =>
      op
        .setName("user")
        .setDescription("The member you want to kick.")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("reason")
        .setDescription("The reason for the kick.")
        .setRequired(false)
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

    const reason = options.getString("reason") || "No reason provided.";

    if (targetMember.roles.highest.poistion >= member.roles.highest.position)
      return interaction.reply({
        embeds: [
          embed
            .setColor("Green")
            .setDescription(
              `❌ **You cannot kick this member as they have a higher role than you.**`
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
            .setColor("Green")
            .setDescription(
              `❌ **That user is Mod/Admin I cannot do that.**`
            ),
        ],
      });

    const emKick = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Member Kicked!`)
      .addFields(
        { name: `Member Tag: `, value: `> \`${target.tag}\``, inline: true },
        { name: `Member ID: `, value: `> \`${target.id}\``, inline: true },
        {
          name: `Kicked By: `,
          value: `> \`${interaction.user.globalName}\``,
          inline: true,
        },
        { name: `Reason: `, value: `\`${reason}\`` }
      )
      .setTimestamp();

    const toSendKick = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`You were kicked.`)
      .setFields(
        { name: "Reason", value: `\`${reason}\`` },
        {
          name: "Kicked By: ",
          value: `> \`${interaction.user.username}\``,
          inline: true,
        },
        {
          name: "Kicked from Server: ",
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

    await targetMember.send({ embeds: [toSendKick] }).catch(() => {});
    await targetMember.kick(reason).then(() => {
      interaction.reply({ embeds: [emKick] });
    });
  },
};
