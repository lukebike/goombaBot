const { SlashCommandBuilder, MessageFlags } = require("discord.js");

const ROLE_IDS = [
  { id: "1392760347391426644", name: "PEAK" },
  { id: "1394991974947225640", name: "Clash Royale" },
  { id: "1398637667901636720", name: "League" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Ping a role with a custom message")
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Which role to ping?")
        .setRequired(true)
        .addChoices(
          ...ROLE_IDS.map((role) => ({
            name: role.name,
            value: role.id,
          }))
        )
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send")
        .setRequired(true)
    ),
  async execute(interaction) {
    const roleId = interaction.options.getString("role");
    const message = interaction.options.getString("message");
    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) {
      return interaction.reply({
        content: "Role not found.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.reply({
      content: `<@&${roleId}> ${message}`,
      allowedMentions: { roles: [roleId] },
    });
  },
};
