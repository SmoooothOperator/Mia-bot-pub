module.exports = {
  name: "ping",
  description: "ping",
  devOnly: true,
  //testOnly; Boolean,
  //options:

  callback: (client, interaction) => {
    interaction.reply({ content: `${client.ws.ping}ms`, ephemeral: false });
  },
};
