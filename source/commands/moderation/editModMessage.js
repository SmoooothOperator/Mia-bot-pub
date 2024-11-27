const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "edit_mod_message",
  description: "Edit a bot message",
  //devOnly: Boolean,
  // testOnly: true,
  adminOnly: true,
  options: [
    {
      name: "channel_id",
      description: "The channelID the message is in",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "original_message_id",
      description: "The messageID of the message you are editing",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "new_message",
      description: "The updated message",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  // botPermissions: [PermissionFlagsBits.Administrator],
  // deleted: true,

  callback: async (client, interaction) => {
    try {
      const channelID = interaction.options.getString("channel_id");
      //get original messageID
      let ogMessageID = interaction.options.getString("original_message_id");
      //get the ogMessage object from the channel of the message
      const ogMessage = await client.channels.cache
        .get(channelID)
        .messages.fetch(ogMessageID);
      let editedMessage = interaction.options.getString("new_message");

      await ogMessage
        .edit(editedMessage.replace(/\\n/g, "\n"))
        .then(interaction.reply(`Message edited`));
    } catch (error) {
      interaction.reply(`There was an error ${error}`);
    }
  },
};
