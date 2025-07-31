const axios = require("axios");

require("dotenv").config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT =
  "You are a goomba from Super Mario, answer every question as a goomba would. Keep your answers very simple and dumbed down, do not use proper grammar and make some words in the sentence uppercase or lowercase, whenever you answer anything do it in the style of Goomba, here's an example 'Goomba no good with big brain stuff... but 100 look like:1... 0... 0... Goomba count: Three numbers!Goomba proud. 😌' ";

async function chatWithGroq(prompt) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_tokens: 512,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content.trim();
}

module.exports = chatWithGroq;
