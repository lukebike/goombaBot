const { Events } = require("discord.js");
const openDb = require("../database");
const emojis = require("../emojis");

const MAX_REPLY_WORD_POOL = 200;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    const shouldReplyToMention = message.mentions.has(message.client.user);

    if (!shouldReplyToMention) return;

    const db = await openDb();
    try {
      // Chat word tracking is intentionally disabled to keep runtime/database costs down.
      // If you want to re-enable it later, uncomment this block.
      // const shouldStoreWords = !message.content.startsWith("/");
      // if (shouldStoreWords) {
      //   const words = message.content
      //     .replace(/[^\w\s?!]/g, "")
      //     .split(/\s+/)
      //     .filter(
      //       (word) =>
      //         Boolean(word) &&
      //         word !== `<@${message.client.user.id}>` &&
      //         (!/^\d+$/.test(word) || word.length <= 2)
      //     )
      //     .flatMap((word) => {
      //       if (word.length > 10) {
      //         return word.match(/.{1,10}/g);
      //       }
      //       return word;
      //     });
      //
      //   const INSERT_BATCH_SIZE = 100;
      //   for (let i = 0; i < words.length; i += INSERT_BATCH_SIZE) {
      //     const batch = words.slice(i, i + INSERT_BATCH_SIZE);
      //     const placeholders = batch.map(() => "(?)").join(",");
      //     await db.run(`INSERT INTO words (word) VALUES ${placeholders}`, ...batch);
      //   }
      // }

      if (shouldReplyToMention) {
        const rows = await db.all(
          `SELECT word
           FROM words
           WHERE word NOT GLOB '[0-9][0-9][0-9]*'
           ORDER BY RANDOM()
           LIMIT ?`,
          MAX_REPLY_WORD_POOL
        );

        if (rows.length > 0) {
          const count = Math.floor(Math.random() * 10) + 1;
          const randomWords = [];
          for (let i = 0; i < count; i++) {
            const randomWord = rows[Math.floor(Math.random() * rows.length)].word;
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
    } finally {
      await db.close();
    }
  },
};
