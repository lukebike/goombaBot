const cron = require("node-cron");

const openDB = require("../database");
require("dotenv").config();

const GUILD_OWNER_ID = "426808324798021642";

module.exports = {
  name: "birthdaySchedule",
  once: true,
  async execute(client) {
    // Schedule for midnight Stockholm time (Europe/Stockholm timezone)
    cron.schedule("0 0 * * *", async () => {
      try {
        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          await dmUser.send(`[LOG] Birthday cron job running at ${new Date().toISOString()}`);
        } catch (e) {
          // Silent fail for logs
        }
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) {
          try {
            const dmUser = await client.users.fetch(GUILD_OWNER_ID);
            await dmUser.send(`[ERROR] Guild not found: ${process.env.GUILD_ID}`);
          } catch (e) {
            // Silent fail for logs
          }
          return;
        }
        const CHANNEL_ID = "1099836076102795315";
        const channel = guild.channels.cache.get(CHANNEL_ID);
        if (!channel) {
          try {
            const dmUser = await client.users.fetch(GUILD_OWNER_ID);
            await dmUser.send(`[ERROR] Channel not found: ${CHANNEL_ID}`);
          } catch (e) {
            // Silent fail for logs
          }
          return;
        }
        // Use Stockholm timezone for date calculation
        const now = new Date().toLocaleString("en-US", {timeZone: "Europe/Stockholm"});
        const stockholmDate = new Date(now);
        const currentDay = stockholmDate.getDate();
        const currentMonth = stockholmDate.getMonth();
        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          await dmUser.send(`[LOG] Checking birthdays for ${currentMonth + 1}-${currentDay} (Stockholm time)`);
        } catch (e) {
          // Silent fail for logs
        }
        const db = await openDB();
        const users = await db.all(
          "SELECT name, birthday FROM birthdays ORDER BY birthday"
        );

        for (let user of users) {
          const [month, day] = user.birthday.split("-").map(Number);
          if (month === currentMonth + 1 && day === currentDay) {
            await channel.send(`@everyone HAPPY BIRTHDAY TO ${user.name}!!!`);
          }
        }
      } catch (err) {
        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          await dmUser.send(`[ERROR] Birthday cron job error: ${err.message}`);
        } catch (e) {
          // Silent fail for logs
        }
      }
    }, {
      timezone: "Europe/Stockholm"
    });
  },
};
