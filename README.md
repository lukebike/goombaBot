# Discord Bot

A feature-rich Discord bot built with [discord.js](https://discord.js.org/) that supports role assignment, team making, event creation, dynamic activity status based on online members, a playful wordbase/emoji reply system, **and birthday features**.

---

## Core Features

- **/roles**: Self-assignable roles via interactive buttons.
- **/play**: Ping a selected role with a custom message.
- **/teammaker**: Randomly split a list of names into two teams.
- **/eventmaker**: Create server events with a title, description, and start time.
- **Dynamic Activity**: Bot status updates to show the number of online members (excluding bots).
- **Wordbase & Emoji Replies**: The bot collects words from chat, stores them, and when pinged, replies with a random string of stored words and emojis.
- **Birthday Commands & Event**: Add, remove, and list birthdays with `/addbirthday`, `/removebirthday`, and `/listbirthdays`. The bot will automatically ping the server on a user's birthday.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A Discord bot token ([How to get one](https://discord.com/developers/applications))
- (Optional) [Fly.io](https://fly.io/), Azure, or another hosting platform account

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/goombabot.git
   cd goombabot
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```
   TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_client_id
   GUILD_ID=your_guild_id
   ```

   Or, set these as secrets on your hosting platform.

4. **Start the bot:**
   ```sh
   npm start
   ```

---

## Commands

- `/roles` — Assign or remove self-assignable roles via buttons.
- `/play role:<role> message:<message>` — Ping a role with a custom message.
- `/teammaker names:<comma-separated-names>` — Randomly split names into two teams.
- `/eventmaker title:<title> description:<desc> start:<YYYY-MM-DDTHH:mm>` — Create a server event.
- `/addbirthday name:<name> birthday:<MM-DD>` — Add your birthday to the list.
- `/removebirthday name:<name>` — Remove a birthday from the list.
- `/listbirthdays` — Show all saved birthdays.

---

## Special Events

### Wordbase & Emoji Reply Event

- The bot listens to all non-command messages, splits them into words (including `?` and `!`), and stores them in a database.
- Numbers longer than 2 digits and the bot's own mention are ignored.
- Words longer than 10 characters are split into chunks.
- When the bot is pinged, it replies with a random selection of stored words and randomly inserted emojis.
- Emojis can be customized to your liking.

### Birthday Ping Event

- The bot automatically checks for birthdays every day at midnight.
- If it's a user's birthday (as registered with `/addbirthday`), the bot will ping the server to celebrate.

---

## Hosting

### Local

Just run `npm start` after setting up your `.env`.

### Fly.io

1. [Install flyctl](https://fly.io/docs/hands-on/install-flyctl/)
2. Deploy:
   ```sh
   fly launch
   fly secrets set TOKEN=your_token CLIENT_ID=your_client_id GUILD_ID=your_guild_id
   fly deploy
   ```

### Azure

- Use the [Azure Tools extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) or the Azure Portal.
- Set environment variables in App Service > Configuration > Application settings.

---
