const { Events, ActivityType } = require("discord.js");
const onlineStatuses = ["online", "idle", "dnd"];


const GUILD_ID = "297672008328675328";
const GUILD_OWNER_ID = "426808324798021642"; 
const guildUpTimes = {};
module.exports = {
  name: Events.PresenceUpdate,
  async execute(oldPresence, newPresence) {
    const client = newPresence.client;
    const guild = newPresence.guild;
    if (!guild) return;

    // Check if logging is enabled
    if (global.botLoggingEnabled === false) return;

    // IMPORTANT: Avoid fetching all members each time (can timeout on large guilds and crash the process)
    // Use the cache which is populated by your intents; this is eventually consistent but safe.
    const onlineCount = guild.members.cache.filter(
      (member) =>
        !member.user.bot && onlineStatuses.includes(member.presence?.status)
    ).size;
    client.user.setActivity(`with my real ${onlineCount} goombales`, {
      type: ActivityType.Playing,
    });
    if (newPresence.userId !== GUILD_ID) return;

    const oldStatus = oldPresence?.status;
    const newStatus = newPresence?.status;
      


    if (newStatus === "idle" && oldStatus !== "idle") {
      guildUpTimes[GUILD_ID] = Date.now();
      try {
        const dmUser = await client.users.fetch(GUILD_OWNER_ID);
        const timeStr = new Date().toLocaleString();
        await dmUser.send(`ping at ${timeStr}`);
      } catch (err) {
        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          await dmUser.send(`[ERROR] Failed to send ping DM: ${err.message}`);
        } catch (e) {
          // Fallback to console if DM fails
          console.error("Failed to send ping DM:", err);
        }
      }
    }


    if (newStatus === "offline" && oldStatus !== "offline") {
      const onlineSince = guildUpTimes[GUILD_ID];
      let durationMsg = "";
      if (onlineSince) {
        const now = Date.now();
        const durationMs = now - onlineSince;
        const seconds = Math.floor((durationMs / 1000) % 60);
        const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        durationMsg = `Ping time out: ${hours}h ${minutes}m ${seconds}s.`;
        delete guildUpTimes[GUILD_ID];
      }
      try {
        const dmUser = await client.users.fetch(GUILD_OWNER_ID);
        const timeStr = new Date().toLocaleString();
        await dmUser.send(`Downtime at ${timeStr}. ${durationMsg}`);
      } catch (err) {
        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          await dmUser.send(`[ERROR] Failed to send downtime DM: ${err.message}`);
        } catch (e) {
          // Fallback to console if DM fails
          console.error("Failed to send downtime DM:", err);
        }
      }
    }
  },
};
