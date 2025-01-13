const {
  SlashCommandBuilder,
  AttachmentBuilder,
  Options,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "rallytime",
  description: "Calculate Rally Time Deltas",
  options: [
    {
      name: "file1",
      description: "Upload the first JSON file",
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },
  ],
  adminOnly: false,

  callback: async (client, interaction) => {
    // Get all attachments from the interaction
    const attachment = interaction.options.getAttachment("file1");

    if (!attachment.name.endsWith(".json")) {
      interaction.reply(
        `${attachment.name}: ❌ Invalid file type (must be .json)`
      );
    }

    try {
      // Fetch the file content
      const response = await fetch(attachment.url);
      const jsonData = await response.json();

      let players = jsonData.players;

      // Get everyone's best laps
      let bestLaps = jsonData.sessions[0].bestLaps;

      // Create a map for player names and their respective car indices
      const playerMap = players.reduce((acc, player, index) => {
        if (player.name) {
          acc[index] = player.name; // Map player name to car index
        }
        return acc;
      }, {});
      const bestLapsData = bestLaps.reduce((acc, entry) => {
        const playerName = playerMap[entry.car]; // Use playerMap to get player name by car index
        if (playerName) {
          acc[playerName] = entry.time;
        }
        return acc;
      }, {});

      return interaction.reply({
        content: `Best Laps:\n\`\`\`json\n${JSON.stringify(
          bestLapsData,
          null,
          2
        )}\n\`\`\``,
      });
    } catch (error) {
      interaction.reply(`${attachment.name}: ❌ Error processing file`);
    }
  },
};
