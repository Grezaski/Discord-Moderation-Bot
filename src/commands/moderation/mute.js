const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, } = require("discord.js");

module.exports = {
  memberPerms: PermissionFlagsBits.ModerateMembers,
  botPerms: PermissionFlagsBits.ModerateMembers,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout / Mute a user.")
    .addUserOption((op) =>
      op
        .setName("user")
        .setDescription("The member you want to mute.")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("time")
        .setDescription("The amount of time the member should be muted for.")
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
    const target = options.getUser("user");
    const timeOption = options.getString("time");
    const bot = interaction.guild.members.me;

    const embed = new EmbedBuilder();

    if (targetMember.roles.highest.poistion >= member.roles.highest.position)
      return interaction.reply({
        embeds: [
          embed
            .setColor("Red")
            .setDescription(
              `❌ **You cannot mute this member as they have a higher role than you.**`
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

    /* Time handling */
    if (!["s", "h", "m", "d"].some((s) => timeOption.endsWith(s))) {
      return await interaction.reply({
        embeds: [
          embed
            .setColor("Red")
            .setDescription(
              `❌ **Invalid time, use \`'s'\` for seconds, \`'m'\` for minutes, \`'h'\` for hours, \`'d'\` for days!** \`[Max time is 28 days]\``
            ),
        ],
      });
    }
    const time = toMS(timeOption);
    const timeInMS = time.ms;
    const replyType = time.anex;

    const emMute = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Member Muted!`)
      .addFields(
        { name: `Member Tag: `, value: `> \`${target.tag}\``, inline: true },
        { name: `Member ID: `, value: `> \`${target.id}\``, inline: true },
        {
          name: `Muted By: `,
          value: `> \`${interaction.user.globalName}\``,
          inline: true,
        },
        { name: `Time: `, value: `\`${replyType}\``, inline: true }
      )
      .setTimestamp();

    const toMute = new EmbedBuilder()
      .setColor(errorColor)
      .setTitle(`You were Muted.`)
      .setFields(
        { name: "Time: ", value: `\`${replyType}\`` },
        {
          name: "Muted By: ",
          value: `> \`${interaction.user.username}\``,
          inline: true,
        },
        {
          name: "Muted in Server: ",
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

    await targetMember.send({ embeds: [toMute] }).catch(() => {});
    await targetMember.timeout(timeInMS).then(() => {
      interaction.reply({ embeds: [emMute] });
    });
  },
};

function toMS(time) {
  if (!time) throw Error("Invalid time");
  const suffix = time[time.length - 1];
  const numericTime = time.slice(0, -1);

  let timeMS;
  let type;

  switch (suffix) {
    case "d":
      timeMS = numericTime * 24 * 60 * 60 * 1000;
      type = "days";
      break;

    case "h":
      timeMS = numericTime * 60 * 60 * 1000;
      type = "hours";
      break;

    case "m":
      timeMS = numericTime * 60 * 1000;
      type = "minutes";
      break;

    case "s":
      timeMS = numericTime * 1000;
      type = "seconds";
      break;
    default:
      break;
  }
  return {
    ms: timeMS,
    anex: `${numericTime} ${type}`,
  };
}
