const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const openDB = require("../../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addbirthday")
    .setDescription("Add your birthday to the list")
    .addStringOption((option) =>
      option.setName("name").setDescription("Enter your name").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("birthday")
        .setDescription("Your birthday (MM-DD")
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const birthday = interaction.options.getString("birthday");

    if (!/^\d{2}-\d{2}$/.test(birthday)) {
      return interaction.reply({
        content: "Please enter your birthday in MM-DD format (e.g., 07-27)",
        flags: MessageFlags.Ephemeral,
      });
    }

    const db = await openDB();
    await db.run(
      "INSERT INTO birthdays (name, birthday) VALUES (?,?)",
      name,
      birthday
    );

    await interaction.reply({
      content: `Birthday for **${name}** (${birthday} added!)`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
