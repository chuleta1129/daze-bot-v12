# daze-bot-v12

A Node.js Discord bot built for my Minecraft server, Dazecraft. It uses Discord.js, Express, RCON, JSON data, and SQLite to connect Discord features with Minecraft server information. AI-assisted coding tools were used during development to find solutions, work through bugs, and build features. This project has been a learning experience in working with existing code, troubleshooting issues, and using AI as a development tool.

## Features

- Modular Discord command handler
- Minecraft/Discord economy leaderboard through RCON
- Minecraft/Discord advancement leaderboard through RCON
- Express `/advancements` endpoint
- Minecraft advancement exporter
- CMI SQLite player information lookup
- Discord DM logging
- Basic Discord Commands
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
7. (optional) I used pm2 to keep the bot running continuously.