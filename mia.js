// Require the necessary discord.js classes
const {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
  Partials,
} = require("discord.js");
const eventHandler = require("./source/handlers/eventHandler");
require("dotenv").config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    // Partials.GuildMember,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
eventHandler(client);

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
