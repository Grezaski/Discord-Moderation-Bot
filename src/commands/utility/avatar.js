const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client, } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("avatar")
      .setDescription("Get a users avatar")
      .addUserOption((o) =>
        o.setName("user").setDescription("User to fetch avatar from")
      ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
      const user = interaction.options.getUser("user") ?? interaction.user;
      const embed = new EmbedBuilder()
        .setAuthor({ iconURL: user.displayAvatarURL(), name: user.username })
        .setColor("Purple")
        .setImage(user.displayAvatarURL({ size: 1024 }));
  
      await interaction.reply({ embeds: [embed] });
    },
  };