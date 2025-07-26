const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.user.setActivity("with my goombales", {
      type: ActivityType.Playing,
    });
  },
};
