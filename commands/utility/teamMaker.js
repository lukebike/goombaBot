const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { shuffle } = require("./shuffle");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("teammaker")
    .setDescription("Makes random teams")
    .addStringOption((option) =>
      option
        .setName("names")
        .setDescription("Insert names and seperate by commas")
        .setRequired(true)
    ),
  async execute(interaction) {
    const names = interaction.options.getString("names");
    if (!names) {
      return interaction.reply({
        content: "Please provide a list of names.",
        ephemeral: true,
      });
    }
    const namesList = names.split(",").map((name) => name.trim());
    shuffle(namesList);
    const mid = Math.ceil(namesList.length / 2);
    const team1 = namesList.slice(0, mid);
    const team2 = namesList.slice(mid);

    const embed = new EmbedBuilder()
      .setTitle("Set of teams")
      .addFields(
        { name: "Team 1", value: team1.join("\n"), inline: true },
        { name: "Team 2", value: team2.join("\n"), inline: true }
      )
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed] });
  },
};
