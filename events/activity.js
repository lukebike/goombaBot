const { ActivityType } = require("discord.js");
require("dotenv");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return;

    const fetchedMembers = await guild.members.fetch({ withPresences: true });

    client.user.setActivity(`with my real ${fetchedMembers.size} goombales`, {
      type: ActivityType.Playing,
    });
  },
};
