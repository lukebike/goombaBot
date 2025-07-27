const { SlashCommandBuilder } = require("discord.js");
const openDB = require("../../database");

function daysUntilBirthday(birthday) {
  const [month, day] = birthday.split("-").map(Number);
  const now = new Date();
  const currentYear = now.getFullYear();
  let nextBirthday = new Date(currentYear, month - 1, day);

  if (
    nextBirthday < now ||
    (now.getMonth() + 1 === month && now.getDate() > day)
  ) {
    nextBirthday = new Date(currentYear + 1, month - 1, day);
  }

  const diffTime = nextBirthday - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listbirthdays")
    .setDescription("List all saved birthdays"),
  async execute(interaction) {
    const db = await openDB();
    const rows = await db.all(
      "SELECT name, birthday FROM birthdays ORDER BY birthday"
    );

    if (rows.length === 0) {
      return interaction.reply({
        content: "No birthdays have been added yet.",
      });
    }

    const birthdayList = rows
      .map((row) => {
        const days = daysUntilBirthday(row.birthday);
        return `**${row.name}**: ${row.birthday} _(in ${days} day${
          days === 1 ? "" : "s"
        })_`;
      })
      .join("\n");

    await interaction.reply({ content: `**Birthday List:**\n${birthdayList}` });
  },
};
