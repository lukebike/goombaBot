const { Events, AttachmentBuilder } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const GUILD_OWNER_ID = "426808324798021642";
const EXPORT_COMMAND = "helloworld";
const STOP_COMMAND = "stop";
const RESUME_COMMAND = "resume";
const EXPORT_FILENAME = "export.txt";

// Global state for controlling logging
global.botLoggingEnabled = global.botLoggingEnabled !== undefined ? global.botLoggingEnabled : true;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.channel.type !== 1) {
      return;
    }
    if (message.author.id !== GUILD_OWNER_ID) {
      return;
    }
    
    const command = message.content.trim().toLowerCase();
    
    // Handle stop command
    if (command === STOP_COMMAND) {
      global.botLoggingEnabled = false;
      await message.channel.send("Logging stopped. Errors will still be reported.");
      return;
    }
    
    // Handle resume command
    if (command === RESUME_COMMAND) {
      global.botLoggingEnabled = true;
      await message.channel.send("Logging resumed. Functionality will be active.");
      return;
    }
    
    // Handle export command
    if (command !== EXPORT_COMMAND) {
      return;
    }

    try {
      const dmUser = await message.client.users.fetch(GUILD_OWNER_ID);
      await dmUser.send("[LOG] Processing export command...");
    } catch (e) {
      // Silent fail for logs
    }

    const client = message.client;
    const dmChannel = message.channel;
    let allMessages = [];
    let lastId;
    let done = false;
    while (!done) {
      const options = { limit: 100 };
      if (lastId) options.before = lastId;
      const messages = await dmChannel.messages.fetch(options);
      if (messages.size === 0) break;
      allMessages = allMessages.concat(Array.from(messages.values()));
      lastId = messages.last().id;
      if (messages.size < 100) done = true;
    }
    console.log(`[exportBotDMs] Fetched ${allMessages.length} messages in DM.`);
    const botMessages = allMessages.filter(m => 
      m.author.id === client.user.id && 
      m.content !== "Bot is online and testing DM capability!" &&
      !m.content.startsWith("[LOG]") &&
      !m.content.startsWith("[ERROR]")
    );
    try {
      const dmUser = await client.users.fetch(GUILD_OWNER_ID);
      await dmUser.send(`[LOG] Found ${botMessages.length} bot messages (excluding test message).`);
    } catch (e) {
      // Silent fail for logs
    }
    if (botMessages.length === 0) {
      await dmChannel.send("No bot messages to export.");
      return;
    }
    const exportText = botMessages
      .map(m => `[${m.createdAt.toLocaleString()}] ${m.content}`)
      .join("\n\n");
    const exportPath = path.join(__dirname, "..", EXPORT_FILENAME);
    fs.writeFileSync(exportPath, exportText, "utf8");
    const attachment = new AttachmentBuilder(exportPath);
    const exportMessage = await dmChannel.send({ content: `Here are all ${botMessages.length} messages I've sent you:`, files: [attachment] });
    
    setTimeout(async () => {
      try {
        await exportMessage.delete();
      } catch (e) {
        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          await dmUser.send(`[ERROR] Failed to delete export message: ${e.message}`);
        } catch (err) {
          // Silent fail for logs
        }
      }
    }, 5 * 60 * 1000); 
    
    for (const m of botMessages) {
      try {
        await m.delete();
      } catch (e) {
        try {
          const dmUser = await client.users.fetch(GUILD_OWNER_ID);
          await dmUser.send(`[ERROR] Failed to delete message ${m.id}: ${e.message}`);
        } catch (err) {
          // Silent fail for logs
        }
      }
    }
    fs.unlinkSync(exportPath);
    try {
      const dmUser = await client.users.fetch(GUILD_OWNER_ID);
      await dmUser.send("[LOG] Export complete and file deleted. Export message will be deleted in 5 minutes.");
    } catch (e) {
      // Silent fail for logs
    }
  },
};
