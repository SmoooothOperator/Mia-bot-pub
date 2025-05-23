const { ApplicationCommandOptionType } = require("discord.js");
const trainNaiveBayes = require("../../utils/trainNaiveBayes");

module.exports = {
  name: "train_nb",
  description: "Train the spam detector with a message and label",
  adminOnly: true,
  options: [
    {
      name: "message",
      description: "The message to train with",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "label",
      description: "Label: spam or legitimate",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Spam", value: "spam" },
        { name: "Legitimate", value: "legitimate" },
      ],
    },
  ],

  callback: async (client, interaction) => {
    try {
      const message = interaction.options.getString("message");
      const label = interaction.options.getString("label");

      const success = await trainNaiveBayes(message, label);

      if (success) {
        await interaction.reply({
          content: `Successfully trained spam detector with message labeled as "${label}"`,
          ephemeral: false,
        });
      } else {
        await interaction.reply({
          content: "Failed to train spam detector. Check logs for errors.",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error in train_spam command:", error);
      await interaction.reply({
        content: "An error occurred while training the spam detector.",
        ephemeral: true,
      });
    }
  },
};
