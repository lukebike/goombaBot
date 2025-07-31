const { Events } = require("discord.js");
const chatWithGroq = require("../groqChat");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    if (/goomba/i.test(message.content)) {
      await message.channel.sendTyping();
      try {
        const answer = await chatWithGroq(message.content);
        await message.reply(answer);
      } catch (err) {
        await message.reply("Sorry, there was an error with the AI.");
        console.error(err);
      }
    }
  },
};
