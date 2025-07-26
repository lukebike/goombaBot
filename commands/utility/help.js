const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists all available commands."),
  async execute(interaction) {
    const commands = interaction.client.commands;
    const commandList = commands
      .map((cmd) => `\`/${cmd.data.name}\` - ${cmd.data.description}`)
      .join("\n");
    const helpEmbed = new EmbedBuilder()
      .setTitle("Available Commands")
      .setDescription(commandList || "No commands found")
      .setColor(0x5865f2);
    await interaction.reply({
      embeds: [helpEmbed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
