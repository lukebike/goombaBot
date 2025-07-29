const cron = require("node-cron");

const openDB = require("../database");
require("dotenv").config();

const ADMIN_USER_ID = "426808324798021642";

module.exports = (client) => {
  cron.schedule("0 0 0 * * *", async () => {
    try {
      console.log("Birthday cron job running at", new Date().toISOString());
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      if (!guild) {
        console.log("Guild not found:", process.env.GUILD_ID);
        return;
      }
      const CHANNEL_ID = "1099836076102795315";
      const channel = guild.channels.cache.get(CHANNEL_ID);
      if (!channel) {
        console.log("Channel not found:", CHANNEL_ID);
        return;
      }
      const now = new Date();
      const currentDay = now.getDate();
      const currentMonth = now.getMonth();
      console.log(`Checking birthdays for ${currentMonth + 1}-${currentDay}`);
      const db = await openDB();
      const users = await db.all(
        "SELECT name, birthday FROM birthdays ORDER BY birthday"
      );

      for (let user of users) {
        const [month, day] = user.birthday.split("-").map(Number);
        if (month === currentMonth + 1 && day === currentDay) {
          channel.send(`@everyone HAPPY BIRTHDAY TO ${user.name}!!!`);
        }
      }
    } catch (err) {
      console.error("Birthday cron job error:", err);
      try {
        const adminUser = await client.users.fetch(ADMIN_USER_ID);
        await adminUser.send(`Birthday cron job error: ${err.message}`);
      } catch (dmErr) {
        console.error("Failed to send DM to admin:", dmErr);
      }
    }
  });
};
