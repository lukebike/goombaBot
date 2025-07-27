const { Events, ActivityType } = require("discord.js");
require("dotenv").config();
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const updateActivity = async () => {
      try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) return;

        const members = await guild.members.fetch({ withPresences: true });
        const onlineCount = members.filter(
          (member) => member.presence?.status === "online" && !member.user.bot
        ).size;

        client.user.setActivity(`with my real ${onlineCount} goombales`, {
          type: ActivityType.Playing,
        });
      } catch (error) {
        console.error("Error setting initial activity:", error);
      }
    };

    // Call the function to set the activity
    await updateActivity();
  },
};
