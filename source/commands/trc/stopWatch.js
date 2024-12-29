const {
  SlashCommandBuilder,
  AttachmentBuilder,
  Options,
  ApplicationCommandOptionType,
  time,
} = require("discord.js");

const translationDictionary = {
  "Zaki Ahmed": "Zaki",
  Aterna23: "Kaiden",
  "Owen Mazepin": "Owen Z",
  mildlyreliablelr: "Owen K",
  Takunology: "Gael",
  nerf: "Irving",
};

const msToTime = require("../../utils/msToTime.js");

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
      required: false,
      type: ApplicationCommandOptionType.Boolean,
      choices: [
        { name: "True", value: true },
        { name: "False", value: false },
      ],
    },
    {
      name: "stagename",
      description: "Name of the Stage",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  adminOnly: false,

  callback: async (client, interaction) => {
    const timeOnly = interaction.options.getBoolean("timeonly") ?? false;

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
      const stageName =
        interaction.options.getString("stagename") ?? jsonData.track;

      let players = jsonData.players;

      // Translate player names using the translation dictionary
      players = players.map((player) => {
        if (player.name && translationDictionary[player.name]) {
          player.name = translationDictionary[player.name];
        }
        return player;
      });

      // Get everyone's best laps
      let bestLaps = jsonData.sessions[0].bestLaps;

      // Create a map for player names and their respective car indices
      const playerMap = players.reduce((acc, player, index) => {
        if (player.name) {
          acc[index] = player.name; // Map player name to car index
        }
        return acc;
      }, {});

      // Find the best lap time
      const bestLapJson = bestLaps.reduce((best, current) => {
        return current.time < best.time ? current : best;
      });
      const bestLap = bestLapJson.time;

      // Match each car's time with the respective player
      let bestLapsData = bestLaps.reduce((acc, entry) => {
        const playerName = playerMap[entry.car]; // Use playerMap to get player name by car index
        if (playerName) {
          const timeDiff = entry.time - bestLap;
          const numBars = Math.round(timeDiff / 2000);
          const bar = "█".repeat(numBars).padEnd(20, " ");
          acc[playerName] = {
            time: msToTime(entry.time),
            delta: msToTime(timeDiff),
            barGraph: bar,
          };
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
      //Message Output
      //////////////////////////////////////////////////////////////////////////
      let message = ` \n**Results for ${stageName}:**\n`;

      if (timeOnly) {
        message = ` \n**${stageName}**\n`;
        // If only times should be displayed
        message += "--------------\n";
        message += "   Lap Time   \n";
        message += "--------------\n";
        for (const [name, data] of Object.entries(bestLapsData)) {
          message += `   ${data.time.padEnd(10, " ")}   \n`;
        }
        message += "--------------\n";
        message += "     Delta    \n";
        message += "--------------\n";
        for (const [name, data] of Object.entries(bestLapsData)) {
          message += `  +${data.delta.toString().padEnd(5, " ")}   \n`;
        }
        message += "--------------\n";
      } else {
        message += "```\n"; // Start a code block
        message += "| Driver     | Lap Time   | Delta     |\n";
        message += "|------------|------------|-----------|\n";

        for (const [name, data] of Object.entries(bestLapsData)) {
          const driver = name.padEnd(10, " "); // Ensure alignment for driver column
          const time = data.time.padEnd(10, " "); // Ensure alignment for time column
          const del = data.delta.toString().padEnd(5, " "); // Ensure alignment for car column

          message += `| ${driver} | ${time} | +${del} |\n`;
        }

        message += "```\n"; // End the code block
        message += "**Δ Graph:**\n";
        // Add graph
        message += `\`\`\``;
        for (const [name, data] of Object.entries(bestLapsData)) {
          message += `${name.padEnd(10, " ")} | ${data.barGraph.padEnd(
            10,
            " "
          )} | +${data.delta}\n\n`;
        }
        message += `\`\`\``;
      }

      return interaction.reply(message);
    } catch (error) {
      interaction.reply(`${attachment.name}: ❌ Error processing file`);
    }
  },
};
