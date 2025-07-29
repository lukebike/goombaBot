const { Events } = require("discord.js");
const openDb = require("../database");
const emojis = [
  "😂",
  "🎉",
  "🔥",
  "💀",
  "😎",
  "👍",
  "✨",
  "🥳",
  "🤖",
  "❤️",
  "🍆",
  "😔",
  "⛓️",
  "🥀",
  "😭",
  "🐍",
  "👳🏿",
  "😀",
];
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const db = await openDb();

    if (!message.content.startsWith("/")) {
      const words = message.content
        .replace(/[^\w\s?!]/g, "")
        .split(/\s+/)
        .filter(
          (word) =>
            Boolean(word) &&
            word !== `<@${message.client.user.id}>` &&
            (!/^\d+$/.test(word) || word.length <= 2)
        )
        .flatMap((word) => {
          if (word.length > 10) {
            return word.match(/.{1,10}/g);
          }
          return word;
        });

      for (const word of words) {
        await db.run("INSERT INTO words (word) VALUES (?)", word);
      }
    }
    if (message.mentions.has(message.client.user)) {
      const rows = await db.all("SELECT word FROM words");
      const filteredRows = rows.filter((row) => !/^\d{3,}$/.test(row.word));
      if (filteredRows.length > 0) {
        const count = Math.floor(Math.random() * 10) + 1;
        const randomWords = [];
        for (let i = 0; i < count; i++) {
          const randomWord =
            filteredRows[Math.floor(Math.random() * filteredRows.length)].word;
          randomWords.push(randomWord);
          if (Math.random() > 0.5) {
            const randomEmoji =
              emojis[Math.floor(Math.random() * emojis.length)];
            randomWords.push(randomEmoji);
          }
        }
        await message.reply(randomWords.join(" "));
      } else {
        await message.reply("lol");
      }
    }
  },
};
