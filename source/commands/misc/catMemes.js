const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "cat_memes",
  description: "generates a link to a cat meme",
  //testOnly; Boolean,
  //options:

  callback: (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle("Here is a cat meme 😼")
      .setDescription("Enjoy")
      .setColor("Random")
      .addFields(
        {
          name: "Link to meme",
          value: "➡️",
          inline: true,
        },
        {
          name: "⬇️",
          value: "http://news.rr.nihalnavath.com/posts/Cute-Cats-c3110dea",
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });
  },
};
