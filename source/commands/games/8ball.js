const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "8ball",
  description: "Ask the magic 8-ball a question!",
  options: [
    {
      name: "question",
      description: "Your question for the magic 8-ball",
      type: 3, // STRING
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    const question = interaction.options.getString("question");

    const responses = [
      // Positive responses
      "🔮 It is certain",
      "🔮 It is decidedly so",
      "🔮 Without a doubt",
      "🔮 Yes definitely",
      "🔮 You may rely on it",
      "🔮 As I see it, yes",
      "🔮 Most likely",
      "🔮 Outlook good",
      "🔮 Yes",
      "🔮 Signs point to yes",

      // Negative responses
      "🔮 Don't count on it",
      "🔮 My reply is no",
      "🔮 My sources say no",
      "🔮 Outlook not so good",
      "🔮 Very doubtful",

      // Neutral responses
      "🔮 Reply hazy, try again",
      "🔮 Ask again later",
      "🔮 Better not tell you now",
      "🔮 Cannot predict now",
      "🔮 Concentrate and ask again",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    // Determine color based on response type
    let color;
    if (
      response.includes("Yes") ||
      response.includes("certain") ||
      response.includes("definitely") ||
      response.includes("likely") ||
      response.includes("good")
    ) {
      color = 0x00ff00; // Green for positive
    } else if (
      response.includes("no") ||
      response.includes("Don't") ||
      response.includes("doubtful") ||
      response.includes("not")
    ) {
      color = 0xff0000; // Red for negative
    } else {
      color = 0xffff00; // Yellow for neutral
    }

    const embed = new EmbedBuilder()
      .setTitle("🎱 Magic 8-Ball")
      .setColor(color)
      .addFields(
        { name: "❓ Your Question", value: question, inline: false },
        { name: "🔮 The Magic 8-Ball Says...", value: response, inline: false }
      )
      .setThumbnail("https://i.imgur.com/8pTGuoQ.png") // 8-ball image
      .setFooter({ text: "The magic 8-ball has spoken!" })
      .setTimestamp();

    const askAgainButton = new ButtonBuilder()
      .setCustomId(`8ball_again_${interaction.user.id}`)
      .setLabel("🎱 Ask Again")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(askAgainButton);

    await interaction.reply({ embeds: [embed], components: [row] });

    // Handle button interaction
    const filter = (i) =>
      i.customId.startsWith("8ball_again_") &&
      i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === `8ball_again_${interaction.user.id}`) {
        const newResponse =
          responses[Math.floor(Math.random() * responses.length)];

        let newColor;
        if (
          newResponse.includes("Yes") ||
          newResponse.includes("certain") ||
          newResponse.includes("definitely") ||
          newResponse.includes("likely") ||
          newResponse.includes("good")
        ) {
          newColor = 0x00ff00;
        } else if (
          newResponse.includes("no") ||
          newResponse.includes("Don't") ||
          newResponse.includes("doubtful") ||
          newResponse.includes("not")
        ) {
          newColor = 0xff0000;
        } else {
          newColor = 0xffff00;
        }

        const newEmbed = new EmbedBuilder()
          .setTitle("🎱 Magic 8-Ball")
          .setColor(newColor)
          .addFields(
            { name: "❓ Your Question", value: question, inline: false },
            {
              name: "🔮 The Magic 8-Ball Says...",
              value: newResponse,
              inline: false,
            }
          )
          .setThumbnail("https://i.imgur.com/8pTGuoQ.png")
          .setFooter({ text: "The magic 8-ball has spoken again!" })
          .setTimestamp();

        await i.update({ embeds: [newEmbed], components: [row] });
      }
    });

    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        askAgainButton.setDisabled(true)
      );
      interaction.editReply({ components: [disabledRow] }).catch(() => {});
    });
  },
};
