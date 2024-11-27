require("dotenv").config();

module.exports = async (client, member) => {
  const ruleChannelID = "812037046616719413";
  const welcomeChannelID = "902108236713426975";
  const memesChannelID = "980291260361351179";
  const guildID = process.env.TAC_GUILD_ID;
  const testGuildID = process.env.TEST_GUILD_ID;
  const testWelcomeChannelID = "1128908643174199337";

  console.log(member);
  const welcomeChannel = member.client.channels.cache.get(welcomeChannelID);
  const testWelcomeChannel =
    member.client.channels.cache.get(testWelcomeChannelID);
  const guildCheck = member.guild.id;

  if (welcomeChannel && guildCheck === guildID) {
    await welcomeChannel.send(
      `Welcome to Triton Auto Club, ${member}! Make sure to check out <#${ruleChannelID}> so we can verify and grant you access to the server.`
    );
  }
  if (testWelcomeChannel && guildCheck === testGuildID) {
    console.log(member.guild.id);
    testWelcomeChannel.send(`Welcome to Caden's test server, ${member}!`);
  }
};
