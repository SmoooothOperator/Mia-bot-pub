const {
  SlashCommandBuilder,
  AttachmentBuilder,
  Options,
  ApplicationCommandOptionType,
} = require("discord.js");

const translationDictionary = {
  "Zaki Ahmed": "Zaki",
  Aterna23: "Kaiden",
  "Owen Mazepin": "Owen Z",
  mildlyreliablelr: "Owen K",
  Takunology: "Gael",
  nerf: "Irving",
};

const msToTime = require("../../utils/msToTime");

module.exports = {
  name: "rallytime",
  description: "Calculate Rally Time Deltas",
  options: [
    {
      name: "file1",
      description: "Upload the first JSON file",
      type: ApplicationCommandOptionType.Attachment,
      required: true,
    },
    {
      name: "timeonly",
      description: "output times only or not",
      required: true,
      type: ApplicationCommandOptionType.Boolean,
      choices: [
        { name: "True", value: true },
        { name: "False", value: false },
      ],
    },
  ],
  adminOnly: false,

  callback: async (client, interaction) => {
    const timeOnly = interaction.options.getBoolean("timeonly");

    // Get all attachments from the interaction
    const attachment = interaction.options.getAttachment("file1");

    if (!attachment.name.endsWith(".json")) {
      interaction.reply(
        `${attachment.name}: Invalid file type (must be .json)`
      );
    }

    try {
      // Fetch the file content
      const response = await fetch(attachment.url);
      const jsonData = await response.json();

      let players = jsonData.players;

      console.log(players);

      // Translate player names using the translation dictionary
      players = players.map((player) => {
        if (player.name && translationDictionary[player.name]) {
          player.name = translationDictionary[player.name];
        }
        return player;
      });

      console.log(players);

      console.log(players);
      // Get everyone's best laps
      let bestLaps = jsonData.sessions[0].bestLaps;

      // Create a map for player names and their respective car indices
      const playerMap = players.reduce((acc, player, index) => {
        console.log(player.name);
        if (player.name) {
          acc[index] = player.name; // Map player name to car index
        }
        return acc;
      }, {});

      console.log(`PlayerMap: ${playerMap}`);
      // Match each car's time with the respective player
      let bestLapsData = bestLaps.reduce((acc, entry) => {
        const playerName = playerMap[entry.car]; // Use playerMap to get player name by car index
        console.log(playerName);
        if (playerName) {
          acc[playerName] = msToTime(entry.time);
        }
        return acc;
      }, {});

      // Sort the translated player names in descending alphabetical order
      bestLapsData = Object.entries(bestLapsData)
        .sort(([a], [b]) => a.localeCompare(b)) // Sort alphabetically by keys
        .reduce((acc, [key, value]) => {
          acc[key] = value; // Rebuild the object
          return acc;
        }, {});

      //////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////
      let message = "**Best Laps:**\n";

      if (timeOnly) {
        // If only times should be displayed
        message += "--------------\n";
        message += "   Lap Time   \n";
        message += "--------------\n";
        for (const [name, time] of Object.entries(bestLapsData)) {
          message += `   ${time.padEnd(10, " ")}   \n`;
        }
        message += "--------------\n";
      } else {
        // If both names and times should be displayed
        message += "--------------------------\n";
        message += "   Driver   //   Lap Time   \n";
        message += "--------------------------\n";

        for (const [name, time] of Object.entries(bestLapsData)) {
          // Add padding to the name so it starts at the 10th character position
          const nameAligned = name.padEnd(8, " "); // Ensure the name is left-aligned and ends at position 10

          // Calculate how many spaces to add before the time, so the time starts at position 20
          const timeAligned = time.padStart(10, " ");
          message += `   `;
          message += `${nameAligned} // ${timeAligned}\n`;
        }
        message += "--------------------------\n";
      }

      return interaction.reply(message);
    } catch (error) {
      interaction.reply(`${attachment.name}: ❌ Error processing file`);
    }
  },
};
