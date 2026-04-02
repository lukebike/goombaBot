const { Events, ActivityType } = require("discord.js");

const TRACKED_USER_ID = "297672008328675328";
const GUILD_OWNER_ID = "426808324798021642";
const activityStartTimes = {};

module.exports = {
  name: Events.PresenceUpdate,
  async execute(oldPresence, newPresence) {
    const client = newPresence.client;
    if (!newPresence || !newPresence.guild) return;

    // Check if logging is enabled
    if (global.botLoggingEnabled === false) return;

    if (newPresence.userId !== TRACKED_USER_ID) return;

    const oldActivities = oldPresence?.activities || [];
    const newActivities = newPresence?.activities || [];

    // Helper to format duration
    const formatDuration = (ms) => {
      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const hours = Math.floor(ms / (1000 * 60 * 60));
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    // Check for new activities (started)
    for (const newAct of newActivities) {
      const key = `${newAct.type}:${newAct.name}`;
      const wasActive = oldActivities.some(
        (a) => a.type === newAct.type && a.name === newAct.name
      );

      if (!wasActive && newAct.name) {
        // Activity started
        activityStartTimes[key] = Date.now();
        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          const timeStr = new Date().toLocaleString();
          await dmUser.send(
            `Started ${ActivityType[newAct.type] || "activity"}: ${newAct.name} at ${timeStr}`
          );
        } catch (err) {
          try {
            const dmUser = await client.users.fetch(GUILD_OWNER_ID);
            await dmUser.send(
              `[ERROR] Failed to send activity start DM: ${err.message}`
            );
          } catch (e) {
            // Fallback to console if DM fails
            console.error("Failed to send activity start DM:", err);
          }
        }
      }
    }

    // Check for ended activities (stopped)
    for (const oldAct of oldActivities) {
      const key = `${oldAct.type}:${oldAct.name}`;
      const stillActive = newActivities.some(
        (a) => a.type === oldAct.type && a.name === oldAct.name
      );

      if (!stillActive && oldAct.name && activityStartTimes[key]) {
        // Activity ended
        const startTime = activityStartTimes[key];
        const now = Date.now();
        const durationMs = now - startTime;
        const durationMsg = formatDuration(durationMs);
        delete activityStartTimes[key];

        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          const timeStr = new Date().toLocaleString();
          await dmUser.send(
            `Stopped ${ActivityType[oldAct.type] || "activity"}: ${oldAct.name} at ${timeStr}. Duration: ${durationMsg}`
          );
        } catch (err) {
          try {
            const dmUser = await client.users.fetch(GUILD_OWNER_ID);
            await dmUser.send(
              `[ERROR] Failed to send activity end DM: ${err.message}`
            );
          } catch (e) {
            // Fallback to console if DM fails
            console.error("Failed to send activity end DM:", err);
          }
        }
      }
    }
  },
};
