module.exports = {
  name: "miata",
  description: "miata is always the answer",
  devOnly: true,
  //testOnly; Boolean,
  //options:

  callback: (client, interaction) => {
    interaction.reply(`_MIATA_`);
  },
};
