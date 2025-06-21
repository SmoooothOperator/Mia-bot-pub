const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "coinflip",
  description: "Flip a coin and test your luck!",
  options: [
    {
      name: "guess",
      description: "Guess heads or tails (optional)",
      type: 3, // STRING
      required: false,
      choices: [
        { name: "🪙 Heads", value: "heads" },
        { name: "🪙 Tails", value: "tails" },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const userGuess = interaction.options.getString("guess");
    const result = Math.random() < 0.5 ? "heads" : "tails";

    const emoji = result === "heads" ? "🪙" : "🪙";
    const resultText = result === "heads" ? "**HEADS**" : "**TAILS**";

    let color = 0x00bfff; // Default blue
    let description = `The coin landed on ${emoji} ${resultText}!`;

    // If user made a guess, check if they were right
    if (userGuess) {
      if (userGuess === result) {
        color = 0x00ff00; // Green for correct
        description = `🎉 **CORRECT!** You guessed ${userGuess} and the coin landed on ${emoji} ${resultText}!`;
      } else {
        color = 0xff0000; // Red for incorrect
        description = `❌ **WRONG!** You guessed ${userGuess} but the coin landed on ${emoji} ${resultText}!`;
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("🪙 Coin Flip!")
      .setDescription(description)
      .setColor(color)
      .addFields({
        name: "Result",
        value: `${emoji} ${resultText}`,
        inline: true,
      })
      .setTimestamp();

    if (userGuess) {
      embed.addFields(
        {
          name: "Your Guess",
          value: `🪙 ${userGuess.toUpperCase()}`,
          inline: true,
        },
        {
          name: "Accuracy",
          value: userGuess === result ? "✅ Correct!" : "❌ Incorrect",
          inline: true,
        }
      );
    }

    const flipAgainButton = new ButtonBuilder()
      .setCustomId(`coinflip_again_${interaction.user.id}`)
      .setLabel("🪙 Flip Again")
      .setStyle(ButtonStyle.Primary);

    const guessHeadsButton = new ButtonBuilder()
      .setCustomId(`coinflip_heads_${interaction.user.id}`)
      .setLabel("Guess Heads")
      .setStyle(ButtonStyle.Secondary);

    const guessTailsButton = new ButtonBuilder()
      .setCustomId(`coinflip_tails_${interaction.user.id}`)
      .setLabel("Guess Tails")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(
      flipAgainButton,
      guessHeadsButton,
      guessTailsButton
    );

    await interaction.reply({ embeds: [embed], components: [row] });

    // Handle button interactions
    const filter = (i) =>
      i.customId.startsWith("coinflip_") && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      let newGuess = null;

      if (i.customId === `coinflip_heads_${interaction.user.id}`) {
        newGuess = "heads";
      } else if (i.customId === `coinflip_tails_${interaction.user.id}`) {
        newGuess = "tails";
      }

      const newResult = Math.random() < 0.5 ? "heads" : "tails";
      const newEmoji = newResult === "heads" ? "🪙" : "🪙";
      const newResultText = newResult === "heads" ? "**HEADS**" : "**TAILS**";

      let newColor = 0x00bfff;
      let newDescription = `The coin landed on ${newEmoji} ${newResultText}!`;

      if (newGuess) {
        if (newGuess === newResult) {
          newColor = 0x00ff00;
          newDescription = `🎉 **CORRECT!** You guessed ${newGuess} and the coin landed on ${newEmoji} ${newResultText}!`;
        } else {
          newColor = 0xff0000;
          newDescription = `❌ **WRONG!** You guessed ${newGuess} but the coin landed on ${newEmoji} ${newResultText}!`;
        }
      }

      const newEmbed = new EmbedBuilder()
        .setTitle("🪙 Coin Flip!")
        .setDescription(newDescription)
        .setColor(newColor)
        .addFields({
          name: "Result",
          value: `${newEmoji} ${newResultText}`,
          inline: true,
        })
        .setTimestamp();

      if (newGuess) {
        newEmbed.addFields(
          {
            name: "Your Guess",
            value: `🪙 ${newGuess.toUpperCase()}`,
            inline: true,
          },
          {
            name: "Accuracy",
            value: newGuess === newResult ? "✅ Correct!" : "❌ Incorrect",
            inline: true,
          }
        );
      }

      await i.update({ embeds: [newEmbed], components: [row] });
    });

    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        flipAgainButton.setDisabled(true),
        guessHeadsButton.setDisabled(true),
        guessTailsButton.setDisabled(true)
      );
      interaction.editReply({ components: [disabledRow] }).catch(() => {});
    });
  },
};
