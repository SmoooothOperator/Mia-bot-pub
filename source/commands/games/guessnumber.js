const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "guessnumber",
  description: "Try to guess the number I'm thinking of!",
  options: [
    {
      name: "range",
      description: "The range to guess within (default: 1-100)",
      type: 4, // INTEGER
      required: false,
      choices: [
        { name: "1-10 (Easy)", value: 10 },
        { name: "1-50 (Medium)", value: 50 },
        { name: "1-100 (Hard)", value: 100 },
        { name: "1-1000 (Extreme)", value: 1000 },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const range = interaction.options.getInteger("range") || 100;
    const secretNumber = Math.floor(Math.random() * range) + 1;
    const maxGuesses = Math.ceil(Math.log2(range)) + 2; // Give a fair number of guesses

    // Store game state
    const gameState = {
      secretNumber,
      range,
      maxGuesses,
      currentGuesses: 0,
      guessHistory: [],
    };

    const embed = new EmbedBuilder()
      .setTitle("🎯 Number Guessing Game")
      .setDescription(
        `I'm thinking of a number between **1** and **${range}**!\n\nYou have **${maxGuesses}** guesses to find it.`
      )
      .setColor(0x00bfff)
      .addFields(
        { name: "Range", value: `1 - ${range}`, inline: true },
        { name: "Guesses Left", value: `${maxGuesses}`, inline: true },
        {
          name: "Difficulty",
          value:
            range <= 10
              ? "🟢 Easy"
              : range <= 50
              ? "🟡 Medium"
              : range <= 100
              ? "🟠 Hard"
              : "🔴 Extreme",
          inline: true,
        }
      )
      .setFooter({ text: "Enter your guess using the buttons below!" })
      .setTimestamp();

    // Create number input buttons for smaller ranges, or text input for larger ranges
    const components = [];

    if (range <= 10) {
      // For small ranges, create buttons for each number
      const buttons = [];
      for (let i = 1; i <= range; i++) {
        buttons.push(
          new ButtonBuilder()
            .setCustomId(`guess_${interaction.user.id}_${i}`)
            .setLabel(i.toString())
            .setStyle(ButtonStyle.Secondary)
        );
      }

      // Split into rows of 5
      for (let i = 0; i < buttons.length; i += 5) {
        components.push(
          new ActionRowBuilder().addComponents(buttons.slice(i, i + 5))
        );
      }
    } else {
      // For larger ranges, create range buttons
      const ranges = [
        { label: "1-25", start: 1, end: 25 },
        { label: "26-50", start: 26, end: 50 },
        { label: "51-75", start: 51, end: 75 },
        { label: "76-100", start: 76, end: 100 },
      ];

      if (range > 100) {
        ranges.push({ label: "101-500", start: 101, end: 500 });
        ranges.push({ label: "501-1000", start: 501, end: 1000 });
      }

      const rangeButtons = ranges
        .filter((r) => r.end <= range)
        .map((r) =>
          new ButtonBuilder()
            .setCustomId(`range_${interaction.user.id}_${r.start}_${r.end}`)
            .setLabel(r.label)
            .setStyle(ButtonStyle.Primary)
        );

      components.push(
        new ActionRowBuilder().addComponents(rangeButtons.slice(0, 5))
      );
      if (rangeButtons.length > 5) {
        components.push(
          new ActionRowBuilder().addComponents(rangeButtons.slice(5))
        );
      }
    }

    await interaction.reply({ embeds: [embed], components });

    // Store game state (in a real bot, you'd use a database or cache)
    global.gameStates = global.gameStates || {};
    global.gameStates[interaction.user.id] = gameState;

    // Handle interactions
    const filter = (i) =>
      (i.customId.startsWith(`guess_${interaction.user.id}_`) ||
        i.customId.startsWith(`range_${interaction.user.id}_`)) &&
      i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 300000,
    }); // 5 minutes

    collector.on("collect", async (i) => {
      const currentGame = global.gameStates[interaction.user.id];
      if (!currentGame) return;

      let guess;

      if (i.customId.startsWith(`guess_${interaction.user.id}_`)) {
        guess = parseInt(i.customId.split("_")[2]);
      } else if (i.customId.startsWith(`range_${interaction.user.id}_`)) {
        // Handle range selection - create buttons for that range
        const parts = i.customId.split("_");
        const start = parseInt(parts[3]);
        const end = parseInt(parts[4]);

        const rangeButtons = [];
        for (let j = start; j <= Math.min(end, currentGame.range); j++) {
          rangeButtons.push(
            new ButtonBuilder()
              .setCustomId(`guess_${interaction.user.id}_${j}`)
              .setLabel(j.toString())
              .setStyle(ButtonStyle.Secondary)
          );
        }

        const rangeComponents = [];
        for (let j = 0; j < rangeButtons.length; j += 5) {
          rangeComponents.push(
            new ActionRowBuilder().addComponents(rangeButtons.slice(j, j + 5))
          );
        }

        const rangeEmbed = new EmbedBuilder()
          .setTitle("🎯 Number Guessing Game")
          .setDescription(
            `Choose a number between **${start}** and **${Math.min(
              end,
              currentGame.range
            )}**:`
          )
          .setColor(0x00bfff)
          .addFields(
            {
              name: "Guesses Left",
              value: `${currentGame.maxGuesses - currentGame.currentGuesses}`,
              inline: true,
            },
            {
              name: "Previous Guesses",
              value:
                currentGame.guessHistory.length > 0
                  ? currentGame.guessHistory.join(", ")
                  : "None",
              inline: true,
            }
          )
          .setTimestamp();

        await i.update({ embeds: [rangeEmbed], components: rangeComponents });
        return;
      }

      currentGame.currentGuesses++;
      currentGame.guessHistory.push(guess);

      let resultEmbed;
      let newComponents = [];

      if (guess === currentGame.secretNumber) {
        // Correct guess!
        resultEmbed = new EmbedBuilder()
          .setTitle("🎉 Congratulations!")
          .setDescription(
            `**You guessed it!** The number was **${currentGame.secretNumber}**!`
          )
          .setColor(0x00ff00)
          .addFields(
            { name: "Your Guess", value: guess.toString(), inline: true },
            {
              name: "Guesses Used",
              value: `${currentGame.currentGuesses}/${currentGame.maxGuesses}`,
              inline: true,
            },
            {
              name: "Difficulty",
              value:
                currentGame.range <= 10
                  ? "🟢 Easy"
                  : currentGame.range <= 50
                  ? "🟡 Medium"
                  : currentGame.range <= 100
                  ? "🟠 Hard"
                  : "🔴 Extreme",
              inline: true,
            }
          )
          .setFooter({ text: "Great job! Want to play again?" })
          .setTimestamp();

        const playAgainButton = new ButtonBuilder()
          .setCustomId(`play_again_${interaction.user.id}`)
          .setLabel("🎮 Play Again")
          .setStyle(ButtonStyle.Success);

        newComponents.push(
          new ActionRowBuilder().addComponents(playAgainButton)
        );

        delete global.gameStates[interaction.user.id];
      } else if (currentGame.currentGuesses >= currentGame.maxGuesses) {
        // Out of guesses
        resultEmbed = new EmbedBuilder()
          .setTitle("💀 Game Over!")
          .setDescription(
            `You've run out of guesses! The number was **${currentGame.secretNumber}**.`
          )
          .setColor(0xff0000)
          .addFields(
            { name: "Your Last Guess", value: guess.toString(), inline: true },
            {
              name: "Correct Answer",
              value: currentGame.secretNumber.toString(),
              inline: true,
            },
            {
              name: "Guesses Used",
              value: `${currentGame.currentGuesses}/${currentGame.maxGuesses}`,
              inline: true,
            }
          )
          .setFooter({ text: "Better luck next time!" })
          .setTimestamp();

        const playAgainButton = new ButtonBuilder()
          .setCustomId(`play_again_${interaction.user.id}`)
          .setLabel("🎮 Try Again")
          .setStyle(ButtonStyle.Danger);

        newComponents.push(
          new ActionRowBuilder().addComponents(playAgainButton)
        );

        delete global.gameStates[interaction.user.id];
      } else {
        // Wrong guess, continue game
        const hint =
          guess < currentGame.secretNumber ? "📈 Too low!" : "📉 Too high!";
        const guessesLeft = currentGame.maxGuesses - currentGame.currentGuesses;

        resultEmbed = new EmbedBuilder()
          .setTitle("🎯 Keep Guessing!")
          .setDescription(
            `${hint} The number is ${
              guess < currentGame.secretNumber ? "higher" : "lower"
            } than **${guess}**.`
          )
          .setColor(0xffff00)
          .addFields(
            { name: "Your Guess", value: guess.toString(), inline: true },
            {
              name: "Guesses Left",
              value: guessesLeft.toString(),
              inline: true,
            },
            {
              name: "Previous Guesses",
              value: currentGame.guessHistory.join(", "),
              inline: false,
            }
          )
          .setFooter({
            text: `Keep trying! You have ${guessesLeft} guesses left.`,
          })
          .setTimestamp();

        // Recreate the original components
        if (currentGame.range <= 10) {
          const buttons = [];
          for (let k = 1; k <= currentGame.range; k++) {
            buttons.push(
              new ButtonBuilder()
                .setCustomId(`guess_${interaction.user.id}_${k}`)
                .setLabel(k.toString())
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentGame.guessHistory.includes(k))
            );
          }

          for (let k = 0; k < buttons.length; k += 5) {
            newComponents.push(
              new ActionRowBuilder().addComponents(buttons.slice(k, k + 5))
            );
          }
        } else {
          const ranges = [
            { label: "1-25", start: 1, end: 25 },
            { label: "26-50", start: 26, end: 50 },
            { label: "51-75", start: 51, end: 75 },
            { label: "76-100", start: 76, end: 100 },
          ];

          if (currentGame.range > 100) {
            ranges.push({ label: "101-500", start: 101, end: 500 });
            ranges.push({ label: "501-1000", start: 501, end: 1000 });
          }

          const rangeButtons = ranges
            .filter((r) => r.end <= currentGame.range)
            .map((r) =>
              new ButtonBuilder()
                .setCustomId(`range_${interaction.user.id}_${r.start}_${r.end}`)
                .setLabel(r.label)
                .setStyle(ButtonStyle.Primary)
            );

          newComponents.push(
            new ActionRowBuilder().addComponents(rangeButtons.slice(0, 5))
          );
          if (rangeButtons.length > 5) {
            newComponents.push(
              new ActionRowBuilder().addComponents(rangeButtons.slice(5))
            );
          }
        }
      }

      await i.update({ embeds: [resultEmbed], components: newComponents });
    });

    collector.on("end", () => {
      if (global.gameStates && global.gameStates[interaction.user.id]) {
        delete global.gameStates[interaction.user.id];
      }
    });
  },
};
