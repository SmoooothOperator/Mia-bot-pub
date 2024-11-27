const { ApplicationCommandOptionType } = require("discord.js");
const quotechannelID = "1206091985371529236";

module.exports = {
  name: "quote",
  description: "create a quote",
  testOnly: true,
  options: [
    {
      name: "quote",
      description: "enter the text you want to quote",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "name",
      description: "enter the name of the person the quote is from",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  callback: async (client, interation) => {
    try {
      let quote = interation.options.getString("quote");
      let name = interation.options.getString("name");
      const quoteChannel = client.channels.cache.get(quotechannelID);

      if (quoteChannel) {
        quoteChannel.send(`"${quote}" - ${name}`);
      }

      interation.reply({ content: "Quoted!", ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },
};
