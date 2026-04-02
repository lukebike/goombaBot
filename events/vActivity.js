const { Events } = require("discord.js");

const DM_RECEIVER_ID = "426808324798021642";
const userVoiceJoinTimes = {};

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    const client = newState.client;
    const userId = newState.id;
    // Ignore bots
    if (newState.member?.user?.bot) return;
    
    // Check if logging is enabled
    if (global.botLoggingEnabled === false) return;

    // User joins a voice channel
    if (!oldState.channelId && newState.channelId) {
      userVoiceJoinTimes[userId] = Date.now();
      try {
        const dmUser = await client.users.fetch(DM_RECEIVER_ID);
        await dmUser.send(`<@${userId}> joined VC: ${newState.channel?.name}`);
      } catch (err) {
        try {
          const dmUser = await client.users.fetch(DM_RECEIVER_ID);
          await dmUser.send(`[ERROR] Failed to send VC join DM: ${err.message}`);
        } catch (e) {
          // Fallback to console if DM fails
          console.error("Failed to send VC join DM:", err);
        }
      }
    }

    // User leaves a voice channel
    if (oldState.channelId && !newState.channelId) {
      const joinedAt = userVoiceJoinTimes[userId];
      let durationMsg = "";
      if (joinedAt) {
        const now = Date.now();
        const durationMs = now - joinedAt;
        const seconds = Math.floor((durationMs / 1000) % 60);
        const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        durationMsg = `Stayed in VC for: ${hours}h ${minutes}m ${seconds}s.`;
        delete userVoiceJoinTimes[userId];
      }
      try {
        const dmUser = await client.users.fetch(DM_RECEIVER_ID);
        const timeStr = new Date().toLocaleString();
        await dmUser.send(`<@${userId}> left VC at ${timeStr}. ${durationMsg}`);
      } catch (err) {
        try {
          const dmUser = await client.users.fetch(DM_RECEIVER_ID);
          await dmUser.send(`[ERROR] Failed to send VC leave DM: ${err.message}`);
        } catch (e) {
          // Fallback to console if DM fails
          console.error("Failed to send VC leave DM:", err);
        }
      }
    }
  },
};
