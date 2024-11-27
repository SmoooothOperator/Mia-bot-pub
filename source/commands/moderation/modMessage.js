const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "bot_message",
  description: "Use the bot to say something in a chat",
  //devOnly: Boolean,
  // testOnly: true,
  adminOnly: true,
  options: [
    {
      name: "channel",
      description: "The channel to send the message",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "message",
      description: "The message to sent",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  // botPermissions: [PermissionFlagsBits.Administrator],
  // deleted: true,

  callback: async (client, interaction) => {
    try {
      let channelID = interaction.options.getString("channel");
      let message = interaction.options.getString("message");
      const targetChannel = client.channels.cache.get(channelID);
      let targetUser = client.channels.cache.get("user_to_mention");

      if (targetChannel) {
        targetChannel.send(`${message.replace(/\\n/g, "\n")}`);
      }

      interaction.reply(`Message sent in <#${channelID}>`);
    } catch (error) {
      interaction.reply(`There was an error ${error}`);
    }
  },
};
