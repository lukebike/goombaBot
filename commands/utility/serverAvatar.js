const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serveravatar")
    .setDescription("Shows a user's avatar in the server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to show the avatar for")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const avatarUrl = member.displayAvatarURL({ dynamic: true, size: 512 });

    const embed = new EmbedBuilder()
      .setTitle(`${member.displayName}'s avatar`)
      .setImage(avatarUrl)
      .setColor(0x5865f2);

    await interaction.reply({ embeds: [embed] });
  },
};
