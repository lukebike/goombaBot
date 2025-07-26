const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

const ROLE_IDS = [
  "1392760347391426644", // PEAK
  "1394991974947225640", // Clash Royale
  "1398637667901636720", // League
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Assign or remove roles"),
  async execute(interaction) {
    const guild = interaction.guild;
    const roles = ROLE_IDS.map((id) => guild.roles.cache.get(id)).filter(
      Boolean
    );

    const embed = new EmbedBuilder()
      .setTitle("Self-Assignable Roles")
      .setDescription("Click a button to add or remove a role.");

    const row = new ActionRowBuilder();
    for (const role of roles) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.name)
          .setStyle(ButtonStyle.Primary)
      );
    }

    await interaction.reply({
      embeds: [embed],
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  },
};
