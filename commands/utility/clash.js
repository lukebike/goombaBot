const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clash")
    .setDescription("Replies with Royale"),
  async execute(interaction) {
    await interaction.reply("Royale");
  },
};
