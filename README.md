# daze-bot-v12

A Node.js Discord bot built for my Minecraft server. The project uses Discord.js, Express, RCON, JSON data, and SQLite to connect Discord features with Minecraft server information.

## Features

- Modular Discord command handler
- Minecraft balance leaderboard through RCON
- Minecraft advancement leaderboard
- Discord advancement leaderboard
- Express `/advancements` endpoint
- Minecraft advancement exporter
- CMI SQLite player information lookup
- Discord DM logging
- Periodic leaderboard updates

## Technologies

- JavaScript / Node.js
- Discord.js
- Express
- RCON
- SQLite / better-sqlite3
- JSON
- dotenv

## Setup

1. Install Node.js.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Fill in the required environment variables.
5. Make sure the Minecraft server paths in `.env` point to your local server.
6. Start the bot with `node index.js`.

## Security

Secrets and local server data are intentionally excluded from this repository. Do not commit `.env`, Discord tokens, RCON passwords, SQLite databases, Minecraft worlds, or other private server data.
