const { AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "vienna_sausage_cheeto_soup",
  description: "Allen's daily meal",

  callback: (client, interaction) => {
    const filePath = "./vienna_sausage_soup.jpg";

    // Create an attachment
    const attachment = new AttachmentBuilder(filePath);

    interaction.reply({ files: [attachment] });
  },
};
