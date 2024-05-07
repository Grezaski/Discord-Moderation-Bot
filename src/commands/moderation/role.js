const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("role")
      .setDescription("Add / Remove a role from a member")
      .addSubcommand((sub) =>
        sub
          .setName("add")
          .setDescription("Add a role to a member")
          .addUserOption((op) =>
            op
              .setName("user")
              .setDescription("The user to add the role to")
              .setRequired(true)
          )
          .addRoleOption((op) =>
            op
              .setName("role")
              .setDescription("The role to add to the member")
              .setRequired(true)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("remove")
          .setDescription("Remove a role from the member")
          .addUserOption((op) =>
            op
              .setName("user")
              .setDescription("The user to remove the role from")
              .setRequired(true)
          )
          .addRoleOption((op) =>
            op
              .setName("role")
              .setDescription("The role to remove from the member")
              .setRequired(true)
          )
      ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
      const { options } = interaction;

      const embed = new EmbedBuilder();
  
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))
        return interaction.reply({
          embeds: [
            embed
              .setDescription(
                `You do not have the required permissions to use this command.,
                  "ManageRoles"`
              )
              .setColor("Red"),
          ],
          ephemeral: true,
        });
      const role = options.getRole("role");
      const user = options.getUser("user");
      const member = options.getMember("user");
      const subCommand = options.getSubcommand(true);
      const bot = interaction.guild.members.me;
  
      if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
        interaction.reply({
          embeds: [
            embed
              .setDescription(
                `I do not have the required permissions to execute this command.,
                  "ManageRoles"`)
              .setColor("Red"),
          ],
          ephemeral: true,
        });
        return;
      }
  
      if (role.position > bot.roles.highest.position) {
        interaction.reply({
          embeds: [
            embed
              .setColor("Red")
              .setDescription(
                `❌ **The role you are trying to manage is higher than mine.**`
              ),
          ],
          ephemeral: true,
        });
        return;
      }
  
      switch (subCommand) {
        case "add":
          embed
            .setDescription(
              `✔ Added role \`${role.name}\` to ${user.username}`
            )
            .setColor("Green");
  
          await member.roles.add(role).then(() => {
            interaction.reply({ embeds: [embed] });
          });
          break;
  
        case "remove":
          embed
            .setDescription(
              `✔ Removed role \`${role.name}\` from ${user.username}`
            )
            .setColor("Green");
  
          await member.roles.remove(role).then(() => {
            interaction.reply({ embeds: [embed] });
          });
          break;
        default:
          break;
      }
    },
  };