const cron = require("node-cron");

const openDB = require("../database");
require("dotenv").config();

module.exports = (client) => {
  cron.schedule("0 0 0 * * *", async () => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return;
    const CHANNEL_ID = "1099836076102795315";

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();

    const db = await openDB();
    const users = await db.all(
      "SELECT name, birthday FROM birthdays ORDER BY birthday"
    );
    for (let user of users) {
      const [month, day] = user.birthday.split("-").map(Number);
      if (month === currentMonth + 1 && day === currentDay) {
        const channel = guild.channels.cache.get(CHANNEL_ID);
        channel.send(`@everyone HAPPY BIRTHDAY TO ${user.name}!!!`);
      }
    }
  });
};
