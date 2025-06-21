const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "rps",
  description: "Play Rock, Paper, Scissors with Mia!",
  options: [
    {
      name: "choice",
      description: "Your choice: rock, paper, or scissors",
      type: 3, // STRING
      required: true,
      choices: [
        { name: "🪨 Rock", value: "rock" },
        { name: "📄 Paper", value: "paper" },
        { name: "✂️ Scissors", value: "scissors" },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const userChoice = interaction.options.getString("choice");
    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    const emojis = {
      rock: "🪨",
      paper: "📄",
      scissors: "✂️",
    };

    let result;
    let color;

    if (userChoice === botChoice) {
      result = "It's a tie! 🤝";
      color = 0xffff00; // Yellow
    } else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      result = "You win! 🎉";
      color = 0x00ff00; // Green
    } else {
      result = "I win! 😎";
      color = 0xff0000; // Red
    }

    const embed = new EmbedBuilder()
      .setTitle("🎮 Rock Paper Scissors!")
      .setColor(color)
      .addFields(
        {
          name: "Your Choice",
          value: `${emojis[userChoice]} ${
            userChoice.charAt(0).toUpperCase() + userChoice.slice(1)
          }`,
          inline: true,
        },
        {
          name: "My Choice",
          value: `${emojis[botChoice]} ${
            botChoice.charAt(0).toUpperCase() + botChoice.slice(1)
          }`,
          inline: true,
        },
        { name: "Result", value: result, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
