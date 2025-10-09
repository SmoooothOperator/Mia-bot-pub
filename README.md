# Mia Discord Bot

Mia is a multi-purpose Discord bot for Triton Auto Club, featuring moderation, spam detection, role management, and fun commands.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [Development Structure](#development-structure)
- [Key Files and Directories](#key-files-and-directories)
- [Spam Detection System](#spam-detection-system)
- [Adding Commands](#adding-commands)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Features

- Role assignment via reactions and slash commands
- Naive Bayes spam detection with human-in-the-loop verification
- Custom reminders and moderation tools
- Fun and utility commands

## Setup

1. **Clone the repository:**

   ```sh
   git clone <repo-url>
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Create a `.env` file:**

   ```
   TOKEN=your_discord_bot_token
   TAC_GUILD_ID=your_main_guild_id
   TEST_GUILD_ID=your_test_guild_id
   OPENAI_KEY=your_openai_api_key
   ```

4. **(Optional) Install additional tools:**
   - If you use the Octopan command, ensure `compress` and `uncompress` binaries are present in `source/huffman/`.

## Configuration

- **config.json**: Contains server IDs, admin/dev lists, and reaction role message IDs.
- **roles.json**: Maps emoji names to Discord role IDs.
- **constants.js**: Stores frequently used channel IDs.

## Running the Bot

Start the bot with:

```sh
node mia.js
```

For development, you may use [nodemon](https://www.npmjs.com/package/nodemon):

```sh
npx nodemon mia.js
```

## Running the Bot 24/7

The bot was previously ran on a raspberry pi 4

The PM2 application manager was used to run the bot 24/7, handling periodic restarts, logs, etc.

BE SURE TO RESTART BOT EVERY COUPLE DAYS TO ENSURE THE DISCORD WEBSOCKET ERROR DOES NOT OCCUR

## Development Structure

- `source/commands/`: Slash command modules (misc, moderation, trc)
- `source/events/`: Event handlers for Discord events (message, reaction, etc.)
- `source/utils/`: Utility functions (spam detection, file I/O, etc.)
- `constants.js`, `config.json`, `roles.json`: Configuration files

## Key Files and Directories

- [`mia.js`](mia.js): Main entry point
- [`source/handlers/eventHandler.js`](source/handlers/eventHandler.js): Loads and attaches event handlers
- [`source/utils/trainNaiveBayes.js`](source/utils/trainNaiveBayes.js): Trains the spam detection model
- [`source/utils/naiveBayesPredict.js`](source/utils/naiveBayesPredict.js): Predicts spam messages
- [`source/utils/verifyNaiveBayes.js`](source/utils/verifyNaiveBayes.js): Handles human verification of spam
- [`NB_training.json`](NB_training.json): Stores the trained spam model

## Spam Detection System

- Uses a Naive Bayes classifier to detect spam in the verification channel.
- Board members can verify or correct spam predictions via reactions.
- The model is continuously trained with new data.

See [Documentation/How Naive Bayes Spam Detector Work.txt](Documentation/How%20Naive%20Bayes%20Spam%20Detector%20Work.txt) for details.

## Adding Commands

1. Add a new file in `source/commands/<category>/`.
2. Export a command object with `name`, `description`, `options`, and `callback`.
3. The command will be auto-registered on startup.

---
