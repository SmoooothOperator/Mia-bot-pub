require("dotenv").config();
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const catFishRoast = [
  "The Catfish is still broken",
  "At this rate, the Catfish will be forever broken",
  "That slow car? It will likely never run again",
  "Still down",
  "The Catfish remains stubbornly broken.",
  "Seems like the Catfish is destined to be forever broken. What a shame.",
  "The Catfish is stuck in its broken state, and there's a loss on how to fix it.",
  "The Catfish has become an inmovable object, permanently",
];
const replyTargets = ["551279669979119616", "389306806393896960"];

let messageSent = false; // Flag to track if the message has been sent
const ruleChannelID = "812037046616719413";
const welcomeChannelID = "902108236713426975";
const memesChannelID = "980291260361351179";
const guildID = process.env.TAC_GUILD_ID;
const testGuildID = process.env.TEST_GUILD_ID;
const testWelcomeChannelID = "1128908643174199337";
//test server welcome channel ID: 1128908643174199337
//TAC server welcome channel ID: 902108236713426975

client.on("ready", () => {
  console.log(`🏎️  ${client.user.tag} is online!`);
  client.user.setActivity({
    name: "headlights go up",
    type: ActivityType.Watching,
  });
  // const channelId = "980291260361351179";
  // const channel = client.channels.cache.get(channelId);

  // if (channel && !messageSent) {
  //   channel.send(
  //     `A message has been deleted due to violation of server rules, please read <#${ruleChannelID}> again to make sure it doesnt happen in the future!`
  //   );
  //   messageSent = true; // Set the flag to true after sending the message
  // }
});

client.on("guildMemberAdd", (member) => {
  console.log(member);
  const welcomeChannel = member.client.channels.cache.get(welcomeChannelID);
  const testWelcomeChannel =
    member.client.channels.cache.get(testWelcomeChannelID);
  const guildCheck = member.guild.id;

  if (welcomeChannel && guildCheck === guildID) {
    welcomeChannel.send(
      `Welcome to Triton Auto Club, ${member}! Make sure to check out <#${ruleChannelID}> so we can verify and grant you access to the server.`
    );
  }
  if (testWelcomeChannel && guildCheck === testGuildID) {
    console.log(member.guild.id);
    testWelcomeChannel.send(`Welcome to Caden's test server, ${member}!`);
  }
});

client.on("messageCreate", (message) => {
  if (
    replyTargets.includes(message.author.id) &&
    message.content.toLowerCase().includes("mia") &&
    message.content.toLowerCase().includes("catfish")
  ) {
    const randomIndex = Math.floor(Math.random() * catFishRoast.length);
    const catFishReply = catFishRoast[randomIndex];
    message.reply(catFishReply);
  } else if (
    replyTargets.includes(message.author.id) &&
    message.content.toLowerCase().includes("mia") &&
    message.content.toLowerCase().includes("running") &&
    message.content.toLowerCase().includes("catfish")
  ) {
    message.reply("Still dead");
  }
});

client.login(process.env.TOKEN);
