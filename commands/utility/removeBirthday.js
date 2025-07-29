const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const openDB = require("../../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removebirthday")
    .setDescription("Remove a birthday from the list")
    .addStringOption((option) =>
      option.setName("name").setDescription("Enter name").setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");

    const db = await openDB();
    await db.run("DELETE FROM BIRTHDAYS WHERE name = ?", name);

    await interaction.reply({
      content: `Birthday for **${name}** deleted.`,
    });
  },
};
