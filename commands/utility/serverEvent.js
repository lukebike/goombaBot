const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eventmaker")
    .setDescription("Creates a server event")
    .addStringOption((option) =>
      option.setName("title").setDescription("Event title").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Event description")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("start").setDescription("Start time").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
  async execute(interaction) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const startInput = interaction.options.getString("start");

    const startTime = new Date(startInput);
    if (isNaN(startTime)) {
      return interaction.reply({
        content:
          "Invalid time format. Use YYYY-MM-DDTHH:mm (e.g., 2025-07-27T20:00).",
        flags: MessageFlags.Ephemeral,
      });
    }
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    const event = await interaction.guild.scheduledEvents.create({
      name: title,
      scheduledStartTime: startTime,
      scheduledEndTime: endTime,
      privacyLevel: 2,
      entityType: 3,
      description: description,
      entityMetadata: { location: "Discord" },
    });

    await interaction.reply({
      content: `@everyone be there or be square \n**${title}**\n${description}\nStarts at: <t:${Math.floor(
        startTime.getTime() / 1000
      )}:F>\n${event.url} `,
      allowedMentions: { parse: ["everyone"] },
    });
  },
};
