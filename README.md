# Discord Bot

A feature-rich Discord bot built with [discord.js](https://discord.js.org/) that supports role assignment, team making, event creation, and dynamic activity status based on online members.

---

## Core Features

- **/roles**: Self-assignable roles via interactive buttons.
- **/play**: Ping a selected role with a custom message.
- **/teammaker**: Randomly split a list of names into two teams.
- **/eventmaker**: Create server events with a title, description, and start time.
- **Dynamic Activity**: Bot status updates to show the number of online members (excluding bots).

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A Discord bot token ([How to get one](https://discord.com/developers/applications))
- (Optional) [Fly.io](https://fly.io/), Azure, or another hosting platform account

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/goombales-bot.git
   cd goombales-bot
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

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
